const pool = require("../../config/db");

/* =========================
   GET SQUADS BY PLATOON
========================= */

async function getSquadsByPlatoon(platoonId) {

    const result = await pool.query(
        `
        SELECT
            id,
            number,
            name
        FROM squads
        WHERE platoon_id = $1
        ORDER BY number
        `,
        [platoonId]
    );

    return result.rows;
}

module.exports = {
    getSquadsByPlatoon
};