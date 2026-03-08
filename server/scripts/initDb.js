require("dotenv").config();

const pool = require("../config/db");

async function init() {
    try {

        // Enable UUID generation
        await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);

        // Create users table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'soldier',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT role_check CHECK (role IN ('admin', 'soldier'))
      );
    `);

        // Auto-update updated_at column
        await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

        await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_trigger
          WHERE tgname = 'set_updated_at'
        ) THEN
          CREATE TRIGGER set_updated_at
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
        END IF;
      END
      $$;
    `);

        console.log("Database initialized successfully");
        process.exit(0);

    } catch (err) {
        console.error("Error initializing database:", err);
        process.exit(1);
    }
}

init();