const express = require("express");
const clientRoutes = require("./client.routes");
const professionalRoutes = require("./professional.routes");
const serviceRoutes = require("./service.routes");
const appoinmentRoutes = require("./appoinment.routes");

const router = express.Router();

router.use("/clients", clientRoutes);
router.use("/professionals", professionalRoutes);
router.use("/services", serviceRoutes);
router.use("/appointments", appoinmentRoutes);

module.exports = router;
