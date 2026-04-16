const { connection } = require("../db/connection");
const { handleMysqlError } = require("../utils/helper");
const { NotFoundError } = require("../utils/error");

function groupProfessionalServices(rows) {
	const map = new Map();
	for (const row of rows) {
		if (!map.has(row.id)) {
			map.set(row.id, {
				id: row.id,
				name: row.name,
				email: row.email,
				phone: row.phone,
				is_active: row.is_active,
				created_at: row.created_at,
				updated_at: row.updated_at,
				services: [],
			});
		}
		if (row.service_id) {
			map.get(row.id).services.push({
				id: row.service_id,
				name: row.service_name,
				duration_minutes: row.duration_minutes,
				price: row.price,
			});
		}
	}
	return [...map.values()];
}

async function getAll() {
	try {
		const [rows] = await connection.query(
			`SELECT p.*, s.id AS service_id, s.name AS service_name, s.duration_minutes, s.price
			FROM professionals p
			LEFT JOIN professionals_services ps ON p.id = ps.professional_id
			LEFT JOIN services s ON ps.service_id = s.id
			ORDER BY p.id`,
		);
		return groupProfessionalServices(rows);
	} catch (error) {
		handleMysqlError(error);
	}
}

async function getById(id) {
	try {
		const [rows] = await connection.query(
			`SELECT p.*, s.id AS service_id, s.name AS service_name, s.duration_minutes, s.price
			FROM professionals p
			LEFT JOIN professionals_services ps ON p.id = ps.professional_id
			LEFT JOIN services s ON ps.service_id = s.id
			WHERE p.id = ?`,
			[id],
		);
		if (rows.length === 0) return null;
		return groupProfessionalServices(rows)[0];
	} catch (error) {
		handleMysqlError(error);
	}
}

async function create(professional) {
	try {
		const { name, email, phone } = professional;
		const [result] = await connection.query("INSERT INTO professionals (name, email, phone) VALUES (?, ?, ?)", [name, email, phone]);
		return { id: result.insertId, ...professional };
	} catch (error) {
		handleMysqlError(error);
	}
}

async function update(id, professional) {
	try {
		const { name, email, phone } = professional;
		await connection.query("UPDATE professionals SET name = ?, email = ?, phone = ? WHERE id = ?", [name, email, phone, id]);
		return { id, ...professional };
	} catch (error) {
		handleMysqlError(error);
	}
}

async function deactivate(id) {
	try {
		await connection.query("UPDATE professionals SET is_active = 0 WHERE id = ?", [id]);
		return { id, active: 0 };
	} catch (error) {
		handleMysqlError(error);
	}
}

async function assignService(professionalId, serviceId) {
	const [profRows] = await connection.query("SELECT id FROM professionals WHERE id = ? AND is_active = 1", [professionalId]);
	if (profRows.length === 0) throw new NotFoundError("Professional Not Found");

	const [serviceRows] = await connection.query("SELECT id FROM services WHERE id = ? AND is_active = 1", [serviceId]);
	if (serviceRows.length === 0) throw new NotFoundError("Service Not Found");

	try {
		await connection.query("INSERT INTO professionals_services (professional_id, service_id) VALUES (?, ?)", [professionalId, serviceId]);
	} catch (error) {
		handleMysqlError(error);
	}
}

module.exports = {
	getAll,
	getById,
	create,
	update,
	deactivate,
	assignService,
};
