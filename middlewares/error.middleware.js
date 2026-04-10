const { sendResponse } = require("../utils/helper");

function notFound(req, res) {
	sendResponse(res, 404, `Route ${req.method} ${req.originalUrl} not found`);
}

function errorHandler(err, req, res, next) {
	if (err.type === "entity.parse.failed") {
		return sendResponse(res, 400, "Invalid JSON in request body");
	}
	sendResponse(res, 500, "Internal server error");
}

module.exports = { notFound, errorHandler };
