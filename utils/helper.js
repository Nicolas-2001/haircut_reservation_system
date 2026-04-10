const os = require("node:os");
const ENVIROMENT = require("../environments/enviroment");
const {
	DuplicateEntryError,
	NullFieldError,
	DataTooLongError,
	InvalidValueError,
	DataOutOfRangeError,
	ForeignKeyNotFoundError,
	ReferencedRowError,
	DatabaseError,
} = require("./error");
const { patterns, mysqlPatterns, MYSQL_ERRORS } = require("./constant");

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
	const { code, sqlMessage } = error;

	switch (code) {
		case MYSQL_ERRORS.DUP_ENTRY: {
			const match = sqlMessage?.match(mysqlPatterns.duplicateEntryKey);
			const field = match ? match[1] : "field";
			throw new DuplicateEntryError(`The ${field} is already in use.`, error);
		}
		case MYSQL_ERRORS.BAD_NULL: {
			const match = sqlMessage?.match(mysqlPatterns.cannotBeNull);
			throw new NullFieldError(match?.[1]);
		}
		case MYSQL_ERRORS.NO_DEFAULT_FOR_FIELD: {
			const match = sqlMessage?.match(mysqlPatterns.columnName);
			throw new NullFieldError(match?.[1]);
		}
		case MYSQL_ERRORS.DATA_TOO_LONG: {
			const match = sqlMessage?.match(mysqlPatterns.dataTooLong);
			throw new DataTooLongError(match?.[1]);
		}
		case MYSQL_ERRORS.TRUNCATED_WRONG_VALUE: {
			const match = sqlMessage?.match(mysqlPatterns.columnName);
			throw new InvalidValueError(match?.[1]);
		}
		case MYSQL_ERRORS.WARN_DATA_OUT_OF_RANGE: {
			const match = sqlMessage?.match(mysqlPatterns.columnName);
			throw new DataOutOfRangeError(match?.[1]);
		}
		case MYSQL_ERRORS.NO_REFERENCED_ROW:
			throw new ForeignKeyNotFoundError();
		case MYSQL_ERRORS.ROW_IS_REFERENCED:
			throw new ReferencedRowError();
		case MYSQL_ERRORS.LOCK_DEADLOCK:
		case MYSQL_ERRORS.LOCK_WAIT_TIMEOUT:
		case MYSQL_ERRORS.CONNECTION_LOST:
		case MYSQL_ERRORS.CONNECTION_REFUSED:
		case MYSQL_ERRORS.TIMEOUT:
		case MYSQL_ERRORS.TOO_MANY_CONNECTIONS:
		case MYSQL_ERRORS.ACCESS_DENIED:
			throw new DatabaseError();
		default:
			throw error;
	}
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
