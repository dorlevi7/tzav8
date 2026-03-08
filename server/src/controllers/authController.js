const authService = require("../services/authService");

async function signup(req, res) {
    try {

        const { username, password } = req.body;

        const user = await authService.createUser(username, password);

        res.status(201).json(user);

    } catch (err) {

        console.error("Signup error:", err);

        // duplicate username in postgres
        if (err.code === "23505") {
            return res.status(400).json({
                error: "Username already exists"
            });
        }

        res.status(500).json({
            error: "Server error"
        });

    }
}

async function login(req, res) {
    try {

        const { username, password } = req.body;

        const user = await authService.loginUser(username, password);

        res.json(user);

    } catch (err) {

        console.error("Login error:", err);

        res.status(401).json({
            error: "Invalid username or password"
        });

    }
}

module.exports = {
    signup,
    login
};