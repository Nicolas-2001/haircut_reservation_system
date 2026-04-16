const { sendResponse, handleError, validateFields, validateFormat } = require("../utils/helper");
const appoinmentRepository = require("../repository/appoinments.repository");

async function getAppointments(req, res) {
	const filters = req.query;
	const validation = validateGetFilters(filters);
	if (!validation.valid) return sendResponse(res, 400, validation.message);

	try {
		const appointments = await appoinmentRepository.getAppointments(filters);
		return sendResponse(res, 200, "Appointments retrieved successfully", appointments);
	} catch (error) {
		handleError(res, error, "Error retrieving appointments");
	}
}

async function getAppointmentById(req, res) {
	const { id } = req.params;
	if (!validateFormat({ id: { value: id, type: "integer" } }).valid) return sendResponse(res, 400, "Invalid appointment id");
	try {
		const appointment = await appoinmentRepository.getAppointmentById(id);
		if (!appointment) return sendResponse(res, 404, "Appointment not found");
		return sendResponse(res, 200, "Appointment retrieved successfully", appointment);
	} catch (error) {
		handleError(res, error, "Error retrieving appointment");
	}
}

async function createAppointment(req, res) {
	const appoinmentData = req.body;
	const validation = validateAppointent(appoinmentData);
	if (!validation.valid) {
		return sendResponse(res, 400, validation.message);
	}

	try {
        const newAppointment = await appoinmentRepository.createAppointment(appoinmentData);
        return sendResponse(res, 201, "Appointment created successfully", newAppointment);
    } catch (error) {
		handleError(res, error, "Error creating appointment");
	}
}

async function updateAppointment(req, res) {
	const { id } = req.params;
	if (!validateFormat({ id: { value: id, type: "integer" } }).valid) return sendResponse(res, 400, "Invalid appointment id");
	const data = req.body;
	const validation = validateUpdateData(data);
	if (!validation.valid) return sendResponse(res, 400, validation.message);

	try {
		const updated = await appoinmentRepository.updateAppointment(id, data);
		return sendResponse(res, 200, "Appointment updated successfully", updated);
	} catch (error) {
		handleError(res, error, "Error updating appointment");
	}
}

function validateGetFilters(filters) {
	const toValidate = {};
	if (filters.client_id) toValidate.client_id = { value: filters.client_id, type: "integer" };
	if (filters.professional_id) toValidate.professional_id = { value: filters.professional_id, type: "integer" };
	if (filters.service_id) toValidate.service_id = { value: filters.service_id, type: "integer" };
	if (filters.status_id) toValidate.status_id = { value: filters.status_id, type: "integer" };
	if (filters.date_from) toValidate.date_from = { value: filters.date_from, type: "date" };
	if (filters.date_to) toValidate.date_to = { value: filters.date_to, type: "date" };
	return validateFormat(toValidate);
}

function validateUpdateData(data) {
	const allowed = ["appointment_date", "start_time", "status_id", "notes"];
	const hasField = allowed.some((f) => data[f] !== undefined);
	if (!hasField) return { valid: false, message: "At least one field is required to update" };

	const toValidate = {};
	if (data.appointment_date) toValidate.appointment_date = { value: data.appointment_date, type: "date" };
	if (data.start_time) toValidate.start_time = { value: data.start_time, type: "time" };
	if (data.status_id) toValidate.status_id = { value: data.status_id, type: "integer" };
	return validateFormat(toValidate);
}

function validateAppointent(data) {
	const validation = validateFields(["client_id", "professional_id", "service_id", "appointment_date", "start_time"], data);
	if (!validation.valid) {
		return validation;
	}

	const formatValidation = validateFormat({
		client_id: { value: data.client_id, type: "integer" },
		professional_id: { value: data.professional_id, type: "integer" },
		service_id: { value: data.service_id, type: "integer" },
		appointment_date: { value: data.appointment_date, type: "date" },
		start_time: { value: data.start_time, type: "time" },
	});

	if (!formatValidation.valid) return formatValidation;

	return validateAppointmentDates(data.appointment_date, data.start_time);
}

function validateAppointmentDates(date, startTime) {
	const now = new Date();
	const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

	if (date < today) return { valid: false, message: "appointment_date cannot be in the past" };

	if (date === today) {
		const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:00`;
		if (startTime <= currentTime) return { valid: false, message: "start_time cannot be in the past" };
	}

	return { valid: true };
}

module.exports = {
	getAppointments,
	getAppointmentById,
	createAppointment,
	updateAppointment,
}
