/**
 * @file      frontend/app/_lib/auth.ts
 * @desc      Lib: 초기 렌더 시 로그인 상태 확인 및 토큰 만료 시 자동 갱신 처리
 *
 * @author    최준호
 * @update    2025.07.21
 */

import { NextRequest } from 'next/server';

import jwt from 'jsonwebtoken';

import { pool } from '@/app/_lib/PostgreSQL';
import { AccessTokenPayload } from '@/app/_types/lib';

export async function getUserIdFromRequest(request: NextRequest): Promise<number> {
  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  try {
    // JWT 토큰 검증 및 디코딩 (secret key는 환경변수에서 가져와야 합니다)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AccessTokenPayload;

    if (!decoded.code) {
      throw new Error('토큰에 사용자 식별 정보(code)가 없습니다.');
    }

    // 디코딩된 code(UUID)를 사용해 DB에서 실제 id(숫자) 조회
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT id FROM users WHERE code = $1', [decoded.code]);
      if (result.rows.length === 0) {
        // 토큰은 유효하지만 DB에 해당 유저가 없는 경우 (예: 탈퇴)
        throw new Error('해당 사용자를 찾을 수 없습니다.');
      }
      // 사용자의 숫자 ID 반환
      return result.rows[0].id;
    } finally {
      client.release(); // DB 커넥션 반환
    }
  } catch (error) {
    // jwt.verify에서 발생하는 모든 에러 (만료, 변조 등) 처리
    console.error('토큰 검증 오류:', error);
    throw new Error('유효하지 않은 토큰입니다.');
  }
}
