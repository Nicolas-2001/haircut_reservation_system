const patterns = {
	letters: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
	alphanumeric: /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]+$/,
	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	phone: /^\d{10}$/,
	integer: /^\d+$/,
	decimal: /^\d{1,8}(\.\d{1,2})?$/,
	date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
	time: /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
};

const mysqlPatterns = {
	duplicateEntryKey: /for key '(?:[^.]+\.)?([^']+)'/i,
	duplicateEntryValue: /Duplicate entry '([^']+)'/i,
	columnName: /column '([^']+)'/i,
	foreignKeyConstraint: /CONSTRAINT `([^`]+)`/i,
	tableName: /Table '([^']+)'/i,
	cannotBeNull: /Column '([^']+)' cannot be null/i,
	dataTooLong: /Data too long for column '([^']+)'/i,
	unknownColumn: /Unknown column '([^']+)'/i,
};

const MYSQL_ERRORS = Object.freeze({
	DUP_ENTRY: "ER_DUP_ENTRY",
	BAD_NULL: "ER_BAD_NULL_ERROR",
	DATA_TOO_LONG: "ER_DATA_TOO_LONG",
	NO_DEFAULT_FOR_FIELD: "ER_NO_DEFAULT_FOR_FIELD",
	NO_REFERENCED_ROW: "ER_NO_REFERENCED_ROW_2",
	ROW_IS_REFERENCED: "ER_ROW_IS_REFERENCED_2",
	TRUNCATED_WRONG_VALUE: "ER_TRUNCATED_WRONG_VALUE",
	WARN_DATA_OUT_OF_RANGE: "ER_WARN_DATA_OUT_OF_RANGE",
	PARSE_ERROR: "ER_PARSE_ERROR",
	BAD_FIELD: "ER_BAD_FIELD_ERROR",
	NO_SUCH_TABLE: "ER_NO_SUCH_TABLE",
	LOCK_DEADLOCK: "ER_LOCK_DEADLOCK",
	LOCK_WAIT_TIMEOUT: "ER_LOCK_WAIT_TIMEOUT",
	CONNECTION_LOST: "PROTOCOL_CONNECTION_LOST",
	CONNECTION_REFUSED: "ECONNREFUSED",
	TIMEOUT: "ETIMEDOUT",
	TOO_MANY_CONNECTIONS: "ER_CON_COUNT_ERROR",
	ACCESS_DENIED: "ER_ACCESS_DENIED_ERROR",
});

module.exports = {
	patterns,
	mysqlPatterns,
	MYSQL_ERRORS,
};
