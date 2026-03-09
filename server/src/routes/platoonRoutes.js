const express = require("express");
const router = express.Router();

const platoonController = require("../controllers/platoonController");

router.post("/create", platoonController.createPlatoon);

/* Get all platoons for company */
router.get("/:companyId", platoonController.getPlatoonsByCompany);

module.exports = router;