class DuplicateEntryError extends Error {
	constructor(message, originalError = null) {
		super(message);
		this.name = "DuplicateEntryError";
		this.statusCode = 409;
		this.originalError = originalError;
	}
}

module.exports = {
	DuplicateEntryError,
};
