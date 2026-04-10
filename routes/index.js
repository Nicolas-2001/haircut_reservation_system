const Router = require("express").Router();
const clientRoutes = require("./client.routes");
const professionalRoutes = require("./professional.routes");
const serviceRoutes = require("./service.routes");

Router.use("/clients", clientRoutes);
Router.use("/professionals", professionalRoutes);
Router.use("/services", serviceRoutes);

module.exports = Router;
