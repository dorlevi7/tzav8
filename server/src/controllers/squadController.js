const squadService = require("../services/squadService");
const handleError = require("../utils/handleControllerError");

/* =========================
   Get squads by platoon
========================= */

async function getSquadsByPlatoon(req, res) {
    try {
        const { platoonId } = req.params;

        const squads = await squadService.getSquadsByPlatoon(platoonId);

        return res.json(squads);
    } catch (err) {
        return handleError(err, res, "Get squads error");
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
                error: "Squad not found",
            });
        }

        return res.json(squad);
    } catch (err) {
        return handleError(err, res, "Get squad error");
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
            password: password,
        });

        return res.status(201).json(squad);
    } catch (err) {
        return handleError(err, res, "Create squad error");
    }
}

/* =========================
   Add soldier to squad
========================= */

async function addSoldier(req, res) {
    try {
        const { squadId } = req.params;

        const soldier = await squadService.addSoldier({
            ...req.body,
            squadId,
        });

        return res.status(201).json(soldier);
    } catch (err) {
        return handleError(err, res, "Add soldier error");
    }
}

module.exports = {
    getSquadsByPlatoon,
    getSquadById,
    createSquad,
    addSoldier,
};