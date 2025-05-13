// lib/db.ts
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.POSTGRESQL_URL!,
});
