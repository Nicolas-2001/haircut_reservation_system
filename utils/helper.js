const os = require("node:os");

function sendResponse(res, statusCode, message, data = null) {
	res.status(statusCode).json({
		status: statusCode,
		message: message,
		data: data,
	});
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

module.exports = {
	sendResponse,
	getLocalIpAddress,
};
