const pool = require("../../config/db");
const bcrypt = require("bcrypt");

/* =========================
   CREATE PLATOON
========================= */

async function createPlatoon(data) {

    const {
        companyId,
        platoonName,

        username,
        password,

        firstName,
        lastName,
        rank,
        personalNumber,
        email,
        phone
    } = data;

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        /* =========================
           1. Get current platoons_count
        ========================= */

        const companyResult = await client.query(
            `
            SELECT platoons_count
            FROM companies
            WHERE id = $1
            FOR UPDATE
            `,
            [companyId]
        );

        if (companyResult.rows.length === 0) {
            throw new Error("Company not found");
        }

        const platoonsCount = companyResult.rows[0].platoons_count;
        const platoonNumber = platoonsCount + 1;

        /* =========================
           2. Create Platoon Commander
        ========================= */

        const passwordHash = await bcrypt.hash(password, 10);

        const userResult = await client.query(
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
                platoon,
                squad
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'soldier',$9,'platoon',$10,NULL)
            RETURNING id
            `,
            [
                username,
                passwordHash,
                firstName,
                lastName,
                rank,
                personalNumber,
                email,
                phone,
                companyId,
                platoonNumber
            ]
        );

        const commanderId = userResult.rows[0].id;

        /* =========================
           3. Create Platoon
        ========================= */

        await client.query(
            `
            INSERT INTO platoons
            (
                company_id,
                number,
                name,
                commander_id
            )
            VALUES ($1,$2,$3,$4)
            `,
            [
                companyId,
                platoonNumber,
                platoonName,
                commanderId
            ]
        );

        /* =========================
           4. Update platoons_count
        ========================= */

        await client.query(
            `
            UPDATE companies
            SET platoons_count = $1
            WHERE id = $2
            `,
            [
                platoonNumber,
                companyId
            ]
        );

        await client.query("COMMIT");

        return {
            platoonNumber,
            commanderId
        };

    } catch (err) {

        await client.query("ROLLBACK");
        throw err;

    } finally {

        client.release();
    }
}

/* =========================
   GET PLATOONS BY COMPANY
========================= */

async function getPlatoonsByCompany(companyId) {

    const result = await pool.query(
        `
        SELECT
            p.id,
            p.number,
            p.name,
            u.first_name,
            u.last_name,
            u.rank
        FROM platoons p
        LEFT JOIN users u
            ON p.commander_id = u.id
        WHERE p.company_id = $1
        ORDER BY p.number
        `,
        [companyId]
    );

    return result.rows;
}

/* =========================
   GET SINGLE PLATOON
========================= */

async function getPlatoonById(platoonId) {

    const result = await pool.query(
        `
        SELECT
            p.id,
            p.number,
            p.name,
            u.id AS commander_id,
            u.first_name,
            u.last_name,
            u.rank,
            u.personal_number,
            u.email,
            u.phone
        FROM platoons p
        LEFT JOIN users u
            ON p.commander_id = u.id
        WHERE p.id = $1
        `,
        [platoonId]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}

module.exports = {
    createPlatoon,
    getPlatoonsByCompany,
    getPlatoonById
};