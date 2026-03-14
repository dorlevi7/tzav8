const pool = require("../../config/db");
const bcrypt = require("bcrypt");

/* =========================
   GET PLATOON INFO
========================= */

async function getPlatoonInfo(platoonId) {

    const result = await pool.query(
        `
        SELECT id, company_id, number
        FROM platoons
        WHERE id = $1
        `,
        [platoonId]
    );

    if (result.rows.length === 0) {
        throw new Error("Platoon not found");
    }

    return result.rows[0];
}

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

        /* Lock company row */

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

        const passwordHash = await bcrypt.hash(password, 10);

        /* Create commander user */

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
                platoon_id,
                squad_id
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'soldier',$9,'platoon',NULL,NULL)
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
                companyId
            ]
        );

        const commanderId = userResult.rows[0].id;

        /* Create platoon */

        const platoonResult = await client.query(
            `
            INSERT INTO platoons
            (
                company_id,
                number,
                name,
                commander_id
            )
            VALUES ($1,$2,$3,$4)
            RETURNING id
            `,
            [
                companyId,
                platoonNumber,
                platoonName,
                commanderId
            ]
        );

        const platoonId = platoonResult.rows[0].id;

        /* Update commander with platoon_id */

        await client.query(
            `
            UPDATE users
            SET platoon_id = $1
            WHERE id = $2
            `,
            [platoonId, commanderId]
        );

        /* Update company platoon counter */

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
            platoonId,
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

    const platoon = result.rows[0];

    const commander = platoon.commander_id
        ? {
            id: platoon.commander_id,
            first_name: platoon.first_name,
            last_name: platoon.last_name,
            rank: platoon.rank,
            personal_number: platoon.personal_number,
            email: platoon.email,
            phone: platoon.phone
        }
        : null;

    /* Get platoon personnel */

    const personnelResult = await pool.query(
        `
        SELECT
            id,
            first_name,
            last_name,
            rank,
            position_level,
            squad_id
        FROM users
        WHERE platoon_id = $1
        ORDER BY position_level
        `,
        [platoonId]
    );

    const personnel = personnelResult.rows;

    /* platoon sergeant */

    const sergeant =
        personnel.find(
            (p) =>
                p.position_level === "platoon" &&
                p.id !== platoon.commander_id
        ) || null;

    /* squad commanders */

    const commanders = personnel.filter(
        (p) =>
            p.position_level === "squad" &&
            p.squad_id !== null
    );

    /* soldiers */

    const soldiers = personnel.filter(
        (p) =>
            p.position_level === "squad" &&
            p.squad_id === null
    );

    return {
        id: platoon.id,
        number: platoon.number,
        name: platoon.name,
        commander,
        sergeant,
        commanders,
        soldiers
    };
}

/* =========================
   ADD PLATOON SERGEANT
========================= */

async function addSergeant(platoonId, data) {

    const {
        username,
        password,
        firstName,
        lastName,
        rank,
        personalNumber,
        email,
        phone
    } = data;

    const platoonInfo = await getPlatoonInfo(platoonId);

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
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
            platoonInfo.company_id,
            platoonId
        ]
    );

    return result.rows[0];
}

/* =========================
   ADD SQUAD COMMANDER
========================= */

async function addCommander(platoonId, data) {

    const {
        username,
        password,
        firstName,
        lastName,
        rank,
        personalNumber,
        email,
        phone,
        squadId
    } = data;

    const platoonInfo = await getPlatoonInfo(platoonId);

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
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
            platoonInfo.company_id,
            platoonId,
            squadId
        ]
    );

    return result.rows[0];
}

/* =========================
   ADD SOLDIER
========================= */

async function addSoldier(platoonId, data) {

    const {
        username,
        password,
        firstName,
        lastName,
        rank,
        personalNumber,
        email,
        phone,
        squadId
    } = data;

    const platoonInfo = await getPlatoonInfo(platoonId);

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
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
            platoonInfo.company_id,
            platoonId,
            squadId
        ]
    );

    return result.rows[0];
}

/* =========================
   GET COMPANY PERSONNEL SUMMARY
========================= */

async function getCompanyPersonnelSummary(companyId) {

    const result = await pool.query(
        `
        SELECT
            (SELECT COUNT(*) FROM users WHERE company_id = $1) AS total_soldiers,

            (SELECT COUNT(*) FROM platoons WHERE company_id = $1) AS total_platoons,

            (
                SELECT COUNT(*)
                FROM squads s
                JOIN platoons p ON s.platoon_id = p.id
                WHERE p.company_id = $1
            ) AS total_squads
        `,
        [companyId]
    );

    return result.rows[0];
}

module.exports = {
    createPlatoon,
    getPlatoonsByCompany,
    getPlatoonById,
    addSergeant,
    addCommander,
    addSoldier,
    getCompanyPersonnelSummary
};