// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const testRoutes = require("./routes/test.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/test", testRoutes);

app.get("/", (req, res) => {
    res.send("Tzav8 backend running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    try {
        await pool.query("SELECT 1");
        console.log("✅ Database connected");
        console.log(`🚀 Server running on port ${PORT}`);
    } catch (err) {
        console.error("❌ Database connection failed", err);
    }
});