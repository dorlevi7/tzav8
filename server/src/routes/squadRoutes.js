const express = require("express");
const router = express.Router();

const squadController = require("../controllers/squadController");

/* =========================
   Get squads by platoon
========================= */

router.get("/platoon/:platoonId", squadController.getSquadsByPlatoon);

/* =========================
   Create squad
========================= */

router.post("/create", squadController.createSquad);

module.exports = router;