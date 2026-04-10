const Router = require("express").Router();
const clientRoutes = require("./client.routes");

Router.use("/clients", clientRoutes);

module.exports = Router;
