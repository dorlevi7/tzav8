const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("../config/db");

const authRoutes = require("./routes/authRoutes");
const platoonRoutes = require("./routes/platoonRoutes"); // NEW

const app = express();

/* ===============================
   CORS MUST BE FIRST
=============================== */

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://tzav8-client.onrender.com"
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true
    })
);

/* ===============================
   Middleware
=============================== */

app.use(express.json());

/* ===============================
   Routes
=============================== */

app.use("/api/auth", authRoutes);
app.use("/api/platoons", platoonRoutes); // NEW

/* ===============================
   Root test route
=============================== */

app.get("/", (req, res) => {
    res.send("Tzav8 backend running");
});

/* ===============================
   Start server
=============================== */

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