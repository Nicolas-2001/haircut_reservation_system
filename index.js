const app = require("./app");
const ENVIRONMENT = require("./environments/enviroment");
const { getLocalIpAddress } = require("./utils/helper");
const PORT = ENVIRONMENT.API_PORT || 8000;
const { testConnection } = require("./db/connection");

async function startServer() {
	await testConnection();

	app.listen(PORT, () => {
		if (ENVIRONMENT.NODE_ENV !== "production") {
			console.log(`Server is running on http://${getLocalIpAddress()}:${PORT}`);
			console.log(`Server is running on http://${getLocalIpAddress()}:${PORT}/api-docs`);
			console.log(`Server is running on http://localhost:${PORT}`);
			console.log(`Server is running on http://localhost:${PORT}/api-docs`);
			console.log(`Server is running in ${ENVIRONMENT.NODE_ENV} mode`);
			console.log(`Date started: ${new Date().toLocaleString()}`);
			console.log(`Press CTRL+C to stop the server`);
		}
	});
}

startServer();
