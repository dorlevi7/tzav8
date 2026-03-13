const pool = require("../../config/db");
const bcrypt = require("bcrypt");

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

/* =========================
   CREATE SQUAD
========================= */

async function createSquad({
    platoonId,
    squadName,
    username,
    password,
    firstName,
    lastName,
    rank,
    personalNumber,
    email,
    phone
}) {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        /* =========================
           Get next squad number
        ========================= */

        const numberResult = await client.query(
            `
            SELECT COALESCE(MAX(number), 0) + 1 AS next_number
            FROM squads
            WHERE platoon_id = $1
            `,
            [platoonId]
        );

        const squadNumber = numberResult.rows[0].next_number;

        /* =========================
           Create squad
        ========================= */

        const squadResult = await client.query(
            `
            INSERT INTO squads (platoon_id, number, name)
            VALUES ($1, $2, $3)
            RETURNING id
            `,
            [platoonId, squadNumber, squadName]
        );

        const squadId = squadResult.rows[0].id;

        /* =========================
           Hash password
        ========================= */

        const hashedPassword = await bcrypt.hash(password, 10);

        /* =========================
           Get company for platoon
        ========================= */

        const platoonInfo = await client.query(
            `
            SELECT company_id
            FROM platoons
            WHERE id = $1
            `,
            [platoonId]
        );

        const companyId = platoonInfo.rows[0].company_id;

        /* =========================
           Create squad commander
        ========================= */

        await client.query(
            `
            INSERT INTO users
            (
                username,
                password_hash,
                first_name,
                last_name,
                rank,
                personal_number,
                email,
                phone,
                role,
                company_id,
                position_level,
                platoon_id,
                squad_id
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'soldier',$9,'squad',$10,$11)
            `,
            [
                username,
                hashedPassword,
                firstName,
                lastName,
                rank,
                personalNumber,
                email,
                phone,
                companyId,
                platoonId,
                squadId
            ]
        );

        await client.query("COMMIT");

        return { squadId };

    } catch (err) {

        await client.query("ROLLBACK");
        throw err;

    } finally {

        client.release();

    }
}

module.exports = {
    getSquadsByPlatoon,
    createSquad
};