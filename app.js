const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");
const { swaggerUi, swaggerSpec } = require("./config/swagger");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
