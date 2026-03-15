const express = require("express");
const router = express.Router();

const platoonController = require("../controllers/platoonController");

router.post("/create", platoonController.createPlatoon);

/* Get single platoon */
router.get("/platoon/:platoonId", platoonController.getPlatoonById);

/* =========================
   Add personnel to platoon
========================= */

router.post("/platoon/:platoonId/sergeant", platoonController.addSergeant);

router.post("/platoon/:platoonId/commander", platoonController.addCommander);

router.post("/platoon/:platoonId/soldier", platoonController.addSoldier);

/* =========================
   Company personnel summary
========================= */

router.get(
    "/:companyId/summary",
    platoonController.getCompanyPersonnelSummary
);

/* =========================
   Platoon personnel summary
   (only users assigned to platoons)
========================= */

router.get(
    "/:companyId/platoon-summary",
    platoonController.getCompanyPlatoonPersonnelSummary
);

/* Get all platoons for company */

router.get("/:companyId", platoonController.getPlatoonsByCompany);

module.exports = router;