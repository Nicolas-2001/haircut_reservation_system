const os = require("node:os");
const ENVIROMENT = require("../environments/enviroment");
const { DuplicateEntryError } = require("./error");
const { patterns, mysqlPatterns } = require("./constant");

function sendResponse(res, statusCode, message, data = null, error = null) {
	if (ENVIROMENT.DEBUG === "true") {
		res.status(statusCode).json({
			status: statusCode,
			message: message,
			data: data,
			error: error ? { name: error.name, message: error.message, ...error } : null,
		});
	} else {
		res.status(statusCode).json({
			status: statusCode,
			message: message,
			data: data,
			error: error ? { name: error.name, message: error.message } : null,
		});
	}
}

function getLocalIpAddress() {
	const interfaces = os.networkInterfaces();
	for (const name of Object.keys(interfaces)) {
		for (const iface of interfaces[name]) {
			if (iface.family === "IPv4" && !iface.internal) {
				return iface.address;
			}
		}
	}
	return "127.0.0.1";
}

function validateFields(fields = [], data = {}) {
	const missingFields = fields.filter((field) => !data[field]?.toString().trim());
	if (missingFields.length > 0) {
		return {
			valid: false,
			message: `Missing required fields: ${missingFields.join(", ")}`,
		};
	}
	return { valid: true };
}

function handleError(res, error, defaultMessage) {
	const statusCode = error.statusCode || 500;
	const message = error.statusCode ? error.message : defaultMessage;
	sendResponse(res, statusCode, message, null, error);
}

function handleMysqlError(error) {
	if (error.code === "ER_DUP_ENTRY") {
		const match = error.sqlMessage?.match(mysqlPatterns.duplicateEntryKey);
		const field = match ? match[1] : "field";
		throw new DuplicateEntryError(`The ${field} is already in use.`, error);
	}
	throw error;
}

function validateFormat(fields = {}) {
	const invalidFields = [];

	for (const [fieldName, { value, type }] of Object.entries(fields)) {
		if (patterns[type] && !patterns[type].test(value)) {
			invalidFields.push(fieldName);
		}
	}

	if (invalidFields.length > 0) {
		return {
			valid: false,
			message: `Invalid format for fields: ${invalidFields.join(", ")}`,
		};
	}

	return { valid: true };
}

module.exports = {
	sendResponse,
	handleError,
	getLocalIpAddress,
	validateFields,
	validateFormat,
	handleMysqlError,
};
