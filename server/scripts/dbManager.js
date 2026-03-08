require("dotenv").config();
const pool = require("../config/db");

const action = process.argv[2];
const target = process.argv[3];

const allowedTableRegex = /^[a-zA-Z0-9_]+$/;

function validateTableName(name) {
    if (!allowedTableRegex.test(name)) {
        throw new Error("Invalid table name");
    }
}

async function run() {
    try {
        switch (action) {
            case "tables": {
                const tables = await pool.query(`
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'public'
        `);
                console.table(tables.rows);
                break;
            }

            case "describe": {
                if (!target) return console.log("Provide table name");
                validateTableName(target);

                const columns = await pool.query(
                    `
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_name = $1
          ORDER BY ordinal_position
        `,
                    [target]
                );
                console.table(columns.rows);
                break;
            }

            case "select": {
                if (!target) return console.log("Provide table name");
                validateTableName(target);

                const rows = await pool.query(
                    `SELECT * FROM "${target}" LIMIT 50`
                );
                console.table(rows.rows);
                break;
            }

            case "clear": {
                if (!target) return console.log("Provide table name");
                validateTableName(target);

                await pool.query(`DELETE FROM "${target}"`);
                console.log(`${target} cleared`);
                break;
            }

            case "drop": {
                if (!target) return console.log("Provide table name");
                validateTableName(target);

                await pool.query(`DROP TABLE IF EXISTS "${target}"`);
                console.log(`${target} dropped`);
                break;
            }

            default:
                console.log(`
Available commands:

node scripts/dbManager.js tables
node scripts/dbManager.js describe <table>
node scripts/dbManager.js select <table>
node scripts/dbManager.js clear <table>
node scripts/dbManager.js drop <table>
        `);
        }

        process.exit(0);
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
}

run();