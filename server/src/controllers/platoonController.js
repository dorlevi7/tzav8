const platoonService = require("../services/platoonService");

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

        /* =========================
           Handle UNIQUE violations
        ========================= */

        if (err.code === "23505") {

            if (err.constraint === "users_username_key") {
                return res.status(400).json({
                    error: "Username already exists"
                });
            }

            if (err.constraint === "users_email_key") {
                return res.status(400).json({
                    error: "Email already exists"
                });
            }

            if (err.constraint === "users_personal_number_key") {
                return res.status(400).json({
                    error: "Personal number already exists"
                });
            }

            return res.status(400).json({
                error: "Duplicate value"
            });
        }

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

        const platoons = await platoonService.getPlatoonsByCompany(companyId);

        return res.json(platoons);

    } catch (err) {

        console.error("Get platoons error:", err);

        return res.status(500).json({
            error: "Server error"
        });
    }
}

module.exports = {
    createPlatoon,
    getPlatoonsByCompany
};