const platoonService = require("../services/platoonService");
const handleError = require("../utils/handleControllerError");

/* =========================
   Create platoon
========================= */

async function createPlatoon(req, res) {
    try {

        const platoon = await platoonService.createPlatoon(req.body);

        return res.status(201).json({
            message: "Platoon created successfully",
            platoon
        });

    } catch (err) {
        return handleError(err, res, "Create platoon error");
    }
}

/* =========================
   Get platoons by company
========================= */

async function getPlatoonsByCompany(req, res) {
    try {

        const { companyId } = req.params;

        const platoons =
            await platoonService.getPlatoonsByCompany(companyId);

        return res.json(platoons);

    } catch (err) {
        return handleError(err, res, "Get platoons error");
    }
}

/* =========================
   Get single platoon
========================= */

async function getPlatoonById(req, res) {
    try {

        const { platoonId } = req.params;

        const platoon =
            await platoonService.getPlatoonById(platoonId);

        if (!platoon) {
            return res.status(404).json({
                error: "Platoon not found"
            });
        }

        return res.json(platoon);

    } catch (err) {
        return handleError(err, res, "Get platoon error");
    }
}

/* =========================
   Add platoon sergeant
========================= */

async function addSergeant(req, res) {
    try {

        const { platoonId } = req.params;

        const sergeant =
            await platoonService.addSergeant(
                platoonId,
                req.body
            );

        return res.status(201).json({
            message: "Sergeant added successfully",
            sergeant
        });

    } catch (err) {
        return handleError(err, res, "Add sergeant error");
    }
}

/* =========================
   Add squad commander
========================= */

async function addCommander(req, res) {
    try {

        const { platoonId } = req.params;

        const commander =
            await platoonService.addCommander(
                platoonId,
                req.body
            );

        return res.status(201).json({
            message: "Commander added successfully",
            commander
        });

    } catch (err) {
        return handleError(err, res, "Add commander error");
    }
}

/* =========================
   Add soldier
========================= */

async function addSoldier(req, res) {
    try {

        const { platoonId } = req.params;

        const soldier =
            await platoonService.addSoldier(
                platoonId,
                req.body
            );

        return res.status(201).json({
            message: "Soldier added successfully",
            soldier
        });

    } catch (err) {
        return handleError(err, res, "Add soldier error");
    }
}

/* =========================
   Get company personnel summary
========================= */

async function getCompanyPersonnelSummary(req, res) {
    try {

        const { companyId } = req.params;

        const summary =
            await platoonService.getCompanyPersonnelSummary(companyId);

        return res.json(summary);

    } catch (err) {
        return handleError(err, res, "Get company summary error");
    }
}

/* =========================
   Get platoon personnel summary
========================= */

async function getCompanyPlatoonPersonnelSummary(req, res) {
    try {

        const { companyId } = req.params;

        const summary =
            await platoonService.getCompanyPlatoonPersonnelSummary(companyId);

        return res.json(summary);

    } catch (err) {
        return handleError(err, res, "Get platoon personnel summary error");
    }
}

module.exports = {
    createPlatoon,
    getPlatoonsByCompany,
    getPlatoonById,
    addSergeant,
    addCommander,
    addSoldier,
    getCompanyPersonnelSummary,
    getCompanyPlatoonPersonnelSummary
};