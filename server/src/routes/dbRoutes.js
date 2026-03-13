const express = require("express");
const router = express.Router();

const dbController = require("../controllers/dbController");

router.get("/tables", dbController.getTables);

router.get("/table/:table", dbController.getTableRows);

module.exports = router;