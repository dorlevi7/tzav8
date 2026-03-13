const dbService = require("../services/dbService");

async function getTables(req, res) {

    try {

        const tables = await dbService.getTables();

        res.json(tables);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: "Failed to fetch tables" });

    }

}

async function getTableRows(req, res) {

    try {

        const { table } = req.params;

        const rows = await dbService.getTableRows(table);

        res.json(rows);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: "Failed to fetch table data" });

    }

}

module.exports = {
    getTables,
    getTableRows
};