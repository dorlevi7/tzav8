const squadService = require("../services/squadService");

/* =========================
   Get squads by platoon
========================= */

async function getSquadsByPlatoon(req, res) {
    try {

        const { platoonId } = req.params;

        const squads = await squadService.getSquadsByPlatoon(platoonId);

        return res.json(squads);

    } catch (err) {

        console.error("Get squads error:", err);

        return res.status(500).json({
            error: "Server error"
        });
    }
}

module.exports = {
    getSquadsByPlatoon
};