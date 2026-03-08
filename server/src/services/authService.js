const pool = require("../../config/db");
const bcrypt = require("bcrypt");

async function createUser(username, password) {

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `
        INSERT INTO users (username, password_hash)
        VALUES ($1, $2)
        RETURNING id, username, role
        `,
        [username, passwordHash]
    );

    return result.rows[0];
}

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
        role: user.role
    };
}

module.exports = {
    createUser,
    loginUser
};