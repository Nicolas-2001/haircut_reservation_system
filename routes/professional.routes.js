const { Router } = require('express');
const { getAllProfessionals, getProfessionalById, createProfessional, updateProfessional, deactivateProfessional, assignService } = require('../controllers/professional.controller');

const router = Router();

router.get('/', getAllProfessionals);
router.get('/:id', getProfessionalById);
router.post('/', createProfessional);
router.patch('/:id', updateProfessional);
router.patch('/:id/deactivate', deactivateProfessional);
router.post('/:id/services', assignService);

module.exports = router;
