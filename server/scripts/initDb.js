require("dotenv").config();

const pool = require("../config/db");

async function init() {
    try {

        /* ===============================
           Enable UUID generation
        =============================== */

        await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);

        /* ===============================
           Companies table
        =============================== */

        await pool.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        company_name VARCHAR(100) NOT NULL,
        battalion_name VARCHAR(100),
        battalion_number VARCHAR(20),

        phone VARCHAR(20),

        platoons_count INTEGER NOT NULL DEFAULT 0,

        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

        /* ===============================
           Users table
        =============================== */

        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (

        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,

        first_name VARCHAR(50),
        last_name VARCHAR(50),
        rank VARCHAR(50),
        personal_number VARCHAR(20),

        email VARCHAR(100),
        phone VARCHAR(20),

        role VARCHAR(20) NOT NULL DEFAULT 'soldier',

        company_id UUID REFERENCES companies(id),

        position_level VARCHAR(20) NOT NULL,

        platoon INTEGER,
        squad VARCHAR(100),

        is_active BOOLEAN NOT NULL DEFAULT TRUE,

        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

        CONSTRAINT role_check CHECK (role IN ('admin','soldier')),

        CONSTRAINT level_check CHECK (
          position_level IN ('company','platoon','squad')
        )

      );
    `);

        /* ===============================
           Platoons table
        =============================== */

        await pool.query(`
      CREATE TABLE IF NOT EXISTS platoons (

        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

        number INTEGER NOT NULL,
        name VARCHAR(100),

        commander_id UUID REFERENCES users(id),

        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

        UNIQUE(company_id, number)

      );
    `);

        /* ===============================
           Squads table
        =============================== */

        await pool.query(`
      CREATE TABLE IF NOT EXISTS squads (

        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        platoon_id UUID NOT NULL REFERENCES platoons(id) ON DELETE CASCADE,

        number INTEGER NOT NULL,
        name VARCHAR(100),

        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

        UNIQUE(platoon_id, number)

      );
    `);

        /* ===============================
           update_updated_at trigger
        =============================== */

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