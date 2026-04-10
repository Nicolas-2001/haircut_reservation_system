const { sendResponse, handleError, validateFields, validateFormat } = require("../utils/helper");
const serviceRepository = require("../repository/service.repository");

async function getAllServices(req, res) {
	try {
		const services = await serviceRepository.getAll();
		sendResponse(res, 200, "Services retrieved successfully", services);
	} catch (error) {
		handleError(res, error, "Error retrieving services");
	}
}

async function getServiceById(req, res) {
	const { id } = req.params;
	try {
		const service = await serviceRepository.getById(id);
		if (service) {
			sendResponse(res, 200, "Service retrieved successfully", service);
		} else {
			sendResponse(res, 404, "Service not found");
		}
	} catch (error) {
		handleError(res, error, "Error retrieving service");
	}
}

async function createService(req, res) {
	const serviceData = req.body;
	const validation = validateServiceData(serviceData);
	if (!validation.valid) {
		return sendResponse(res, 400, validation.message);
	}
	try {
		const newService = await serviceRepository.create(serviceData);
		sendResponse(res, 201, "Service created successfully", newService);
	} catch (error) {
		handleError(res, error, "Error creating service");
	}
}

async function updateService(req, res) {
	const { id } = req.params;
	const serviceData = req.body;
	const validation = validateServiceData(serviceData);
	if (!validation.valid) {
		return sendResponse(res, 400, validation.message);
	}
	try {
		const updatedService = await serviceRepository.update(id, serviceData);
		sendResponse(res, 200, "Service updated successfully", updatedService);
	} catch (error) {
		handleError(res, error, "Error updating service");
	}
}

async function deactivateService(req, res) {
	const { id } = req.params;
	try {
		const result = await serviceRepository.deactivate(id);
		sendResponse(res, 200, "Service deactivated successfully", result);
	} catch (error) {
		handleError(res, error, "Error deactivating service");
	}
}

function validateServiceData(serviceData) {
	const validation = validateFields(["name", "description", "duration_minutes", "price"], serviceData);
	if (!validation.valid) return validation;

	return validateFormat({
		name: { value: serviceData.name, type: "letters" },
		description: { value: serviceData.description, type: "letters" },
		duration_minutes: { value: String(serviceData.duration_minutes), type: "integer" },
		price: { value: String(serviceData.price), type: "decimal" },
	});
}

module.exports = {
	getAllServices,
	getServiceById,
	createService,
	updateService,
	deactivateService,
};
