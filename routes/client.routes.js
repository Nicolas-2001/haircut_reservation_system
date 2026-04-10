const { Router } = require("express");
const { getAllClients, getClientById, createClient, updateClient, deactivateClient } = require("../controllers/client.controller");

const router = Router();

router.get("/", getAllClients);

router.get("/:id", getClientById);

router.post("/", createClient);

router.patch("/:id", updateClient);

router.patch("/:id/deactivate", deactivateClient);

module.exports = router;
