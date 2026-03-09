const pool = require("../../config/db");
const bcrypt = require("bcrypt");

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

        /* =========================
           1. Create Company
        ========================= */

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

        /* =========================
           2. Create Admin User (Company level)
        ========================= */

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
        throw err;

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
        SELECT *
        FROM users
        WHERE username = $1
        `,
        [username]
    );

    const user = result.rows[0];

    if (!user) {
        throw new Error("Invalid username or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
        throw new Error("Invalid username or password");
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
        platoon: user.platoon,
        squad: user.squad
    };
}

module.exports = {
    createUser,
    loginUser
};