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

/* =========================
   Get squad by ID
========================= */

async function getSquadById(req, res) {
    try {

        const { squadId } = req.params;

        const squad = await squadService.getSquadById(squadId);

        if (!squad) {
            return res.status(404).json({
                error: "Squad not found"
            });
        }

        return res.json(squad);

    } catch (err) {

        console.error("Get squad error:", err);

        return res.status(500).json({
            error: "Server error"
        });
    }
}

/* =========================
   Create squad
========================= */

async function createSquad(req, res) {
    try {

        const { password, ...restOfData } = req.body;

        const squad = await squadService.createSquad({
            ...restOfData,
            password: password
        });

        return res.status(201).json(squad);

    } catch (err) {

        console.error("Create squad error:", err);

        return res.status(500).json({
            error: "Server error"
        });
    }
}

module.exports = {
    getSquadsByPlatoon,
    getSquadById,
    createSquad
};