// test.routes.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Create table
router.get("/init", async (req, res) => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS test_items (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        res.json({ message: "Table initialized" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Insert item
router.post("/", async (req, res) => {
    try {
        const { name } = req.body;
        const result = await pool.query(
            "INSERT INTO test_items (name) VALUES ($1) RETURNING *",
            [name]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all items
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM test_items ORDER BY id DESC"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;