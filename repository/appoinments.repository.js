const { connection } = require("../db/connection");
const { NotFoundError, ReservationAlreadyExistsError } = require("../utils/error");
const { handleMysqlError } = require("../utils/helper");

async function checkClientExists(clientId) {
	const [rows] = await connection.query("SELECT id FROM clients WHERE id = ? AND is_active = 1", [clientId]);
	return rows.length > 0;
}

async function checkProfessionalExists(professionalId) {
	const [rows] = await connection.query("SELECT id FROM professionals WHERE id = ? AND is_active = 1", [professionalId]);
	return rows.length > 0;
}

async function getServiceDuration(serviceId) {
	const [rows] = await connection.query("SELECT duration_minutes FROM services WHERE id = ? AND is_active = 1", [serviceId]);
	if (rows.length === 0) throw new NotFoundError("Service Not Found");
	return rows[0].duration_minutes;
}

function calcEndTime(startTime, durationMinutes) {
	const [h, m, s] = startTime.split(":").map(Number);
	const total = h * 60 + m + durationMinutes;
	const endH = Math.floor(total / 60) % 24;
	const endM = total % 60;
	return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}:${String(s ?? 0).padStart(2, "0")}`;
}

async function checkProfessionalAvailability(professionalId, date, timeStart, timeEnd) {
	const [rows] = await connection.query(
		`
        SELECT id FROM available_times WHERE
            professional_id = ? AND
            start_time <= ? AND
            end_time >= ? AND
            day_week_id = DAYOFWEEK(?)
        `,
		[professionalId, timeStart, timeEnd, date],
	);
	return rows.length > 0;
}

async function hasAppointmentConflict(conn, professionalId, date, timeStart, timeEnd, excludeId = null) {
	const params = [professionalId, date, timeEnd, timeStart];
	let query = `
        SELECT id FROM appointment WHERE
            professional_id = ? AND
            appointment_date = ? AND
            status_id != 4 AND
            start_time < ? AND
            end_time > ?
    `;

	if (excludeId) {
		query += " AND id != ?";
		params.push(excludeId);
	}

	query += " FOR UPDATE";

	const [rows] = await conn.query(query, params);
	return rows.length > 0;
}

async function getAppointments(filters) {
	const conditions = [];
	const params = [];

	if (filters.client_id) {
		conditions.push("a.client_id = ?");
		params.push(filters.client_id);
	}
	if (filters.professional_id) {
		conditions.push("a.professional_id = ?");
		params.push(filters.professional_id);
	}
	if (filters.service_id) {
		conditions.push("a.service_id = ?");
		params.push(filters.service_id);
	}
	if (filters.status_id) {
		conditions.push("a.status_id = ?");
		params.push(filters.status_id);
	}
	if (filters.date_from) {
		conditions.push("a.appointment_date >= ?");
		params.push(filters.date_from);
	}
	if (filters.date_to) {
		conditions.push("a.appointment_date <= ?");
		params.push(filters.date_to);
	}

	const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

	const [rows] = await connection.query(
		`SELECT a.*, s.name AS status_name
		FROM appointment a
		JOIN appointment_status s ON a.status_id = s.id
		${where}
		ORDER BY a.appointment_date, a.start_time`,
		params,
	);
	return rows;
}

async function getAppointmentById(id) {
	const [rows] = await connection.query(
		`SELECT a.*, s.name AS status_name
		FROM appointment a
		JOIN appointment_status s ON a.status_id = s.id
		WHERE a.id = ?`,
		[id],
	);
	return rows[0] ?? null;
}

async function createAppointment(appointment) {
	const clientExists = await checkClientExists(appointment.client_id);
	if (!clientExists) throw new NotFoundError("Client Not Found");

	const professionalExists = await checkProfessionalExists(appointment.professional_id);
	if (!professionalExists) throw new NotFoundError("Professional Not Found");

	const durationMinutes = await getServiceDuration(appointment.service_id);
	const endTime = calcEndTime(appointment.start_time, durationMinutes);

	const availabilityExists = await checkProfessionalAvailability(appointment.professional_id, appointment.appointment_date, appointment.start_time, endTime);
	if (!availabilityExists) throw new NotFoundError("Professional Not Available");

	const conn = await connection.getConnection();
	try {
		await conn.beginTransaction();

		const hasConflict = await hasAppointmentConflict(conn, appointment.professional_id, appointment.appointment_date, appointment.start_time, endTime);
		if (hasConflict) throw new ReservationAlreadyExistsError("The professional already has an appointment in that time slot.");

		const [result] = await conn.query(
			`INSERT INTO
				appointment (client_id, professional_id, service_id, appointment_date, start_time, end_time, status_id, notes)
				VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
			[
				appointment.client_id,
				appointment.professional_id,
				appointment.service_id,
				appointment.appointment_date,
				appointment.start_time,
				endTime,
				appointment.notes ?? null,
			],
		);

		await conn.commit();
		return result.insertId;
	} catch (error) {
		await conn.rollback();
		throw error.statusCode ? error : handleMysqlError(error);
	} finally {
		conn.release();
	}
}

async function updateAppointment(id, data) {
	const [rows] = await connection.query("SELECT * FROM appointment WHERE id = ?", [id]);
	if (rows.length === 0) throw new NotFoundError("Appointment Not Found");

	const current = rows[0];
	const newDate = data.appointment_date ?? current.appointment_date;
	const newStartTime = data.start_time ?? current.start_time;

	let newEndTime = null;
	if (data.appointment_date || data.start_time) {
		const durationMinutes = await getServiceDuration(current.service_id);
		newEndTime = calcEndTime(newStartTime, durationMinutes);

		const availabilityExists = await checkProfessionalAvailability(current.professional_id, newDate, newStartTime, newEndTime);
		if (!availabilityExists) throw new NotFoundError("Professional Not Available");
	}

	const conn = await connection.getConnection();
	try {
		await conn.beginTransaction();

		if (newEndTime) {
			const hasConflict = await hasAppointmentConflict(conn, current.professional_id, newDate, newStartTime, newEndTime, id);
			if (hasConflict) throw new ReservationAlreadyExistsError("The professional already has an appointment in that time slot.");
		}

		const setClauses = [];
		const params = [];

		if (data.appointment_date) {
			setClauses.push("appointment_date = ?");
			params.push(data.appointment_date);
		}
		if (data.start_time) {
			setClauses.push("start_time = ?");
			params.push(data.start_time);
		}
		if (newEndTime) {
			setClauses.push("end_time = ?");
			params.push(newEndTime);
		}
		if (data.status_id) {
			setClauses.push("status_id = ?");
			params.push(data.status_id);
		}
		if (data.notes !== undefined) {
			setClauses.push("notes = ?");
			params.push(data.notes);
		}

		params.push(id);
		await conn.query(`UPDATE appointment SET ${setClauses.join(", ")} WHERE id = ?`, params);

		await conn.commit();
	} catch (error) {
		await conn.rollback();
		throw error.statusCode ? error : handleMysqlError(error);
	} finally {
		conn.release();
	}
}

module.exports = { getAppointments, getAppointmentById, createAppointment, updateAppointment };
