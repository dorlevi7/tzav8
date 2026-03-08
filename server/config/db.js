// config/db.js

const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in environment variables");
}

/**
 * Render Postgres requires SSL connection
 */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

/**
 * Test initial connection
 */
pool
    .connect()
    .then((client) => {
        console.log("Database connected successfully");
        client.release();
    })
    .catch((err) => {
        console.error("Database connection error:", err.message);
        process.exit(1);
    });

/**
 * Global error listener
 */
pool.on("error", (err) => {
    console.error("Unexpected database error:", err.message);
    process.exit(1);
});

module.exports = pool;