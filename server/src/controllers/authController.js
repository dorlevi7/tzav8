const authService = require("../services/authService");
const handleError = require("../utils/handleControllerError");

/* =========================
   SIGNUP
========================= */

async function signup(req, res) {
    try {

        const user = await authService.createUser(req.body);

        return res.status(201).json(user);

    } catch (err) {
        return handleError(err, res, "Signup error");
    }
}

/* =========================
   LOGIN
========================= */

async function login(req, res) {
    try {

        const { username, password } = req.body;

        const user = await authService.loginUser(username, password);

        return res.json(user);

    } catch (err) {
        return handleError(err, res, "Login error");
    }
}

module.exports = {
    signup,
    login
};