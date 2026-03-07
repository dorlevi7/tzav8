require("dotenv").config();
const pool = require("../config/db");
const bcrypt = require("bcrypt");

async function createAdmin() {
    try {
        const password = "123456"; // temporary password
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(`
            INSERT INTO users (username, password_hash, role)
            VALUES ($1, $2, $3)
        `, ["admin", hashedPassword, "admin"]);

        console.log("Admin user created successfully");
        process.exit();
    } catch (err) {
        console.error("Error creating admin:", err);
        process.exit(1);
    }
}

createAdmin();