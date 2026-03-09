const express = require("express");
const router = express.Router();

const platoonController = require("../controllers/platoonController");

router.post("/create", platoonController.createPlatoon);

/* Get single platoon */
router.get("/platoon/:platoonId", platoonController.getPlatoonById);

/* Get all platoons for company */
router.get("/:companyId", platoonController.getPlatoonsByCompany);

module.exports = router;