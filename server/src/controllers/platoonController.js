const platoonService = require("../services/platoonService");

/* =========================
   Handle duplicate DB errors
========================= */

function handleDuplicateError(err, res) {

    if (err.code !== "23505") return false;

    if (err.constraint === "users_username_key") {
        res.status(409).json({
            error: "Username already exists"
        });
        return true;
    }

    if (err.constraint === "users_email_key") {
        res.status(409).json({
            error: "Email already exists"
        });
        return true;
    }

    if (err.constraint === "users_personal_number_key") {
        res.status(409).json({
            error: "Personal number already exists"
        });
        return true;
    }

    res.status(409).json({
        error: "Duplicate value"
    });

    return true;
}

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

        console.error("Create platoon error:", err);

        if (handleDuplicateError(err, res)) return;

        return res.status(500).json({
            error: "Server error"
        });
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

        console.error("Get platoons error:", err);

        return res.status(500).json({
            error: "Server error"
        });
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

        console.error("Get platoon error:", err);

        return res.status(500).json({
            error: "Server error"
        });
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

        console.error("Add sergeant error:", err);

        if (handleDuplicateError(err, res)) return;

        return res.status(500).json({
            error: "Server error"
        });
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

        console.error("Add commander error:", err);

        if (handleDuplicateError(err, res)) return;

        return res.status(500).json({
            error: "Server error"
        });
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

        console.error("Add soldier error:", err);

        if (handleDuplicateError(err, res)) return;

        return res.status(500).json({
            error: "Server error"
        });
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

        console.error("Get company summary error:", err);

        return res.status(500).json({
            error: "Server error"
        });
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

        console.error("Get platoon personnel summary error:", err);

        return res.status(500).json({
            error: "Server error"
        });
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