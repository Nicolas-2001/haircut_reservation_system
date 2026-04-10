const { Router } = require('express');
const { getAllProfessionals, getProfessionalById, createProfessional, updateProfessional, deactivateProfessional } = require('../controllers/professional.controller');

const router = Router();

router.get('/', getAllProfessionals);

router.get('/:id', getProfessionalById);

router.post('/', createProfessional);

router.patch('/:id', updateProfessional);

router.patch('/:id/deactivate', deactivateProfessional);

module.exports = router;
