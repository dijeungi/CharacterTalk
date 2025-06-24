import { Pool } from 'pg';

// PostgreSQL 인스턴스 생성
export const pool = new Pool({
  connectionString: process.env.POSTGRESQL_URL!,
});
