const { Router } = require("express");
const { getAllServices, getServiceById, createService, updateService, deactivateService } = require("../controllers/service.controller");

const router = Router();

router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.post("/", createService);
router.patch("/:id", updateService);
router.patch("/:id/deactivate", deactivateService);

module.exports = router;
