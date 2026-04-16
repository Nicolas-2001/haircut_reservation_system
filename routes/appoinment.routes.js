const { Router } = require('express');
const { getAppointments, getAppointmentById, createAppointment, updateAppointment } = require('../controllers/appointment.controller');

const router = Router();

router.get('/', getAppointments);
router.get('/:id', getAppointmentById);
router.post('/', createAppointment);
router.patch('/:id', updateAppointment);

module.exports = router;
