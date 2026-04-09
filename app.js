const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const sendResponse = require("./utils/helper").sendResponse;

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
	sendResponse(res, 200, "Welcome to the Haircut Reservation System API");
});

module.exports = app;
