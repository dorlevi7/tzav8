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
   Create squad
========================= */

async function createSquad(req, res) {
    try {

        // הוספת הסיסמה המוצפנת
        const { password, ...restOfData } = req.body;

        // קרא לפונקציה ליצירת כיתה עם שאר הפרמטרים
        const squad = await squadService.createSquad({
            ...restOfData,
            password: password  // הסיסמה תישלח כבר מהשרת
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
    createSquad
};