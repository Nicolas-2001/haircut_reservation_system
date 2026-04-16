const { sendResponse, handleError, validatePersonData, validateFields, validateFormat } = require('../utils/helper');
const professionalRepository = require('../repository/professional.repository');

async function getAllProfessionals(req, res) {
    try {
        const professionals = await professionalRepository.getAll();
        sendResponse(res, 200, 'Professionals retrieved successfully', professionals);
    } catch (error) {
        handleError(res, error, 'Error retrieving professionals');
    }
}

async function getProfessionalById(req, res) {
    const { id } = req.params;
    try {
        const professional = await professionalRepository.getById(id);
        if (professional) {
            sendResponse(res, 200, 'Professional retrieved successfully', professional);
        } else {
            sendResponse(res, 404, 'Professional not found');
        }
    } catch (error) {
        handleError(res, error, 'Error retrieving professional');
    }
}

async function createProfessional(req, res) {
    const professionalData = req.body;
    const validation = validateProfessionalData(professionalData);
    if (!validation.valid) {
        return sendResponse(res, 400, validation.message);
    }
    try {
        const newProfessional = await professionalRepository.create(professionalData);
        sendResponse(res, 201, 'Professional created successfully', newProfessional);
    } catch (error) {
        handleError(res, error, 'Error creating professional');
    }
}

async function updateProfessional(req, res) {
    const { id } = req.params;
    const professionalData = req.body;
    const validation = validateProfessionalData(professionalData);
    if (!validation.valid) {
        return sendResponse(res, 400, validation.message);
    }
    try {
        const updatedProfessional = await professionalRepository.update(id, professionalData);
        sendResponse(res, 200, 'Professional updated successfully', updatedProfessional);
    } catch (error) {
        handleError(res, error, 'Error updating professional');
    }
}

async function deactivateProfessional(req, res) {
    const { id } = req.params;
    try {
        const result = await professionalRepository.deactivate(id);
        sendResponse(res, 200, 'Professional deactivated successfully', result);
    } catch (error) {
        handleError(res, error, 'Error deactivating professional');
    }
}

async function assignService(req, res) {
    const { id } = req.params;
    const { service_id } = req.body;

    const validation = validateFields(["service_id"], req.body);
    if (!validation.valid) return sendResponse(res, 400, validation.message);

    const formatValidation = validateFormat({
        id: { value: id, type: "integer" },
        service_id: { value: service_id, type: "integer" },
    });
    if (!formatValidation.valid) return sendResponse(res, 400, formatValidation.message);

    try {
        await professionalRepository.assignService(id, service_id);
        sendResponse(res, 200, 'Service assigned successfully');
    } catch (error) {
        handleError(res, error, 'Error assigning service');
    }
}

function validateProfessionalData(professionalData) {
	return validatePersonData(professionalData);
}

module.exports = {
    getAllProfessionals,
    getProfessionalById,
    createProfessional,
    updateProfessional,
    deactivateProfessional,
    assignService,
}
