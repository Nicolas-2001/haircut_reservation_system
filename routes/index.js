const Router = require("express").Router();
const clientRoutes = require("./client.routes");
const professionalRoutes = require("./professional.routes");

Router.use("/clients", clientRoutes);
Router.use("/professionals", professionalRoutes);

module.exports = Router;
