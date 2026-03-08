const authService = require("../services/authService");

async function signup(req, res) {
    try {
        const { username, password } = req.body;

        const user = await authService.createUser(username, password);

        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function login(req, res) {
    try {

        const { username, password } = req.body;

        const user = await authService.loginUser(username, password);

        res.json(user);

    } catch (err) {

        res.status(401).json({ error: err.message });

    }
}

module.exports = {
    signup,
    login
};