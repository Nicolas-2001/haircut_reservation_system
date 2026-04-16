class DuplicateEntryError extends Error {
	constructor(message, originalError = null) {
		super(message);
		this.name = "DuplicateEntryError";
		this.statusCode = 409;
		this.originalError = originalError;
	}
}

class NullFieldError extends Error {
	constructor(field = "unknown") {
		super(`The field '${field}' cannot be null.`);
		this.name = "NullFieldError";
		this.statusCode = 400;
	}
}

class DataTooLongError extends Error {
	constructor(field = "unknown") {
		super(`The value for '${field}' exceeds the maximum allowed length.`);
		this.name = "DataTooLongError";
		this.statusCode = 400;
	}
}

class InvalidValueError extends Error {
	constructor(field = "unknown") {
		super(`Invalid value provided for '${field}'.`);
		this.name = "InvalidValueError";
		this.statusCode = 400;
	}
}

class DataOutOfRangeError extends Error {
	constructor(field = "unknown") {
		super(`The value for '${field}' is out of the allowed range.`);
		this.name = "DataOutOfRangeError";
		this.statusCode = 400;
	}
}

class ForeignKeyNotFoundError extends Error {
	constructor() {
		super("The referenced record does not exist.");
		this.name = "ForeignKeyNotFoundError";
		this.statusCode = 400;
	}
}

class ReferencedRowError extends Error {
	constructor() {
		super("Cannot delete or update: the record is referenced by other records.");
		this.name = "ReferencedRowError";
		this.statusCode = 409;
	}
}

class DatabaseError extends Error {
	constructor() {
		super("Database service is currently unavailable.");
		this.name = "DatabaseError";
		this.statusCode = 503;
	}
}

class ReservationAlreadyExistsError extends Error {
	constructor(message = "The time slot is not available.") {
		super(message);
		this.name = "ReservationAlreadyExistsError";
		this.statusCode = 409;
	}
}

class NotFoundError extends Error {
	constructor(message = "Not Found") {
		super(message);
		this.name = "NotFoundError";
		this.statusCode = 404;
	}
}

module.exports = {
	DuplicateEntryError,
	NullFieldError,
	DataTooLongError,
	InvalidValueError,
	DataOutOfRangeError,
	ForeignKeyNotFoundError,
	ReferencedRowError,
	DatabaseError,
	ReservationAlreadyExistsError,
	NotFoundError,
};
