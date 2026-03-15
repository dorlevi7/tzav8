const express = require("express");
const router = express.Router();

const squadController = require("../controllers/squadController");

/* =========================
   Get squads by platoon
========================= */

router.get("/platoon/:platoonId", squadController.getSquadsByPlatoon);

/* =========================
   Get squad by ID
========================= */

router.get("/:squadId", squadController.getSquadById);

/* =========================
   Create squad
========================= */

router.post("/create", squadController.createSquad);

/* =========================
   Add soldier to squad
========================= */

router.post("/:squadId/soldiers", squadController.addSoldier);

module.exports = router;