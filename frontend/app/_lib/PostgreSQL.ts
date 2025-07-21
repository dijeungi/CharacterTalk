/**
 * @file      frontend/app/_lib/PostgreSQL.ts
 * @desc      Lib: PostgreSQL 연결을 위한 Pool 인스턴스 초기화 설정
 *
 * @author    최준호
 * @update    2025.07.21
 */

import { Pool } from 'pg';

// PostgreSQL 인스턴스 생성
export const pool = new Pool({
  connectionString: process.env.POSTGRESQL_URL!,
});
