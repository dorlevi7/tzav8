const pool = require("../../config/db");
const bcrypt = require("bcrypt");

const handleDbError = require("../utils/dbErrors");

/* =========================
   SIGNUP
========================= */

async function createUser(data) {

    const {
        username,
        password,
        firstName,
        lastName,
        rank,
        personalNumber,
        email,
        phone,
        companyName,
        battalionName,
        battalionNumber,
        companyPhone
    } = data;

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const passwordHash = await bcrypt.hash(password, 10);

        /* Create company */

        const companyResult = await client.query(
            `
            INSERT INTO companies
            (company_name, battalion_name, battalion_number, phone)
            VALUES ($1,$2,$3,$4)
            RETURNING id
            `,
            [companyName, battalionName, battalionNumber, companyPhone]
        );

        const companyId = companyResult.rows[0].id;

        /* Create company commander */

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
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'admin',$9,'company',NULL,NULL)
            RETURNING id, username, role
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

        await client.query("COMMIT");

        return userResult.rows[0];

    } catch (err) {
        await client.query("ROLLBACK");
        handleDbError(err);
        throw err; // fallback (safety net)
    } finally {

        client.release();
    }
}

/* =========================
   LOGIN
========================= */

async function loginUser(username, password) {

    const result = await pool.query(
        `
        SELECT
            id,
            username,
            password_hash,
            role,
            company_id,
            first_name,
            last_name,
            rank,
            position_level,
            platoon_id,
            squad_id
        FROM users
        WHERE username = $1
        `,
        [username]
    );

    const user = result.rows[0];

    if (!user) {
        const error = new Error("Invalid username or password");
        error.status = 401;
        throw error;
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
        const error = new Error("Invalid username or password");
        error.status = 401;
        throw error;
    }

    return {
        id: user.id,
        username: user.username,
        role: user.role,
        companyId: user.company_id,
        firstName: user.first_name,
        lastName: user.last_name,
        rank: user.rank,
        positionLevel: user.position_level,
        platoonId: user.platoon_id,
        squadId: user.squad_id
    };
}

module.exports = {
    createUser,
    loginUser
};