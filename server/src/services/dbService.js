const pool = require("../../config/db");

async function getTables() {

    const result = await pool.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
    `);

    return result.rows;
}

async function getTableRows(tableName) {

    const result = await pool.query(
        `SELECT * FROM "${tableName}" LIMIT 50`
    );

    return result.rows;
}

module.exports = {
    getTables,
    getTableRows
};