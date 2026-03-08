const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("../config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors({
    origin: "https://tzav8-client.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Tzav8 backend running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", async () => {
    try {
        await pool.query("SELECT 1");
        console.log("✅ Database connected");
        console.log(`🚀 Server running on port ${PORT}`);
    } catch (err) {
        console.error("❌ Database connection failed", err.message);
    }
});