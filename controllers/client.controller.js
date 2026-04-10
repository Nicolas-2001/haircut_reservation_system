const { sendResponse, handleError, validatePersonData } = require("../utils/helper");
const clientRepository = require("../repository/client.repository");

async function getAllClients(req, res) {
	try {
		const clients = await clientRepository.getAll();
		sendResponse(res, 200, "Clients retrieved successfully", clients);
	} catch (error) {
		handleError(res, error, "Error retrieving clients");
	}
}

async function getClientById(req, res) {
	const { id } = req.params;
	try {
		const client = await clientRepository.getById(id);
		if (client) {
			sendResponse(res, 200, "Client retrieved successfully", client);
		} else {
			sendResponse(res, 404, "Client not found");
		}
	} catch (error) {
		handleError(res, error, "Error retrieving client");
	}
}

async function createClient(req, res) {
	const clientData = req.body;
	const validation = validateClientData(clientData);
	if (!validation.valid) {
		return sendResponse(res, 400, validation.message);
	}
	try {
		const newClient = await clientRepository.create(clientData);
		sendResponse(res, 201, "Client created successfully", newClient);
	} catch (error) {
		handleError(res, error, "Error creating client");
	}
}

async function updateClient(req, res) {
	const { id } = req.params;
	const clientData = req.body;
	const validation = validateClientData(clientData);
	if (!validation.valid) {
		return sendResponse(res, 400, validation.message);
	}
	try {
		const updatedClient = await clientRepository.update(id, clientData);
		sendResponse(res, 200, "Client updated successfully", updatedClient);
	} catch (error) {
		handleError(res, error, "Error updating client");
	}
}

async function deactivateClient(req, res) {
	const { id } = req.params;
	try {
		const result = await clientRepository.deactivate(id);
		sendResponse(res, 200, "Client deactivated successfully", result);
	} catch (error) {
		handleError(res, error, "Error deactivating client");
	}
}

function validateClientData(clientData) {
	return validatePersonData(clientData);
}

module.exports = {
	getAllClients,
	getClientById,
	createClient,
	updateClient,
	deactivateClient,
};
