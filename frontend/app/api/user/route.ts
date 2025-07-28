/**
 * @file         frontend/app/api/user/route.ts
 * @desc         사용자의 인증 상태를 확인하는 API
 *
 * @summary      사용자 인증 상태 확인
 * @description  요청에 포함된 액세스 토큰을 검증하여 사용자의 로그인 상태와 기본 정보를 반환합니다. 토큰이 없거나 만료된 경우에도 200 상태 코드와 함께 로그인되지 않았음을 알립니다.
 * @param        {NextRequest} req - 들어오는 요청 객체. 'access_token' 쿠키를 포함할 수 있습니다.
 * @responses
 *   200: 요청 처리에 성공했으며, 응답 본문에 로그인 상태(`isLoggedIn`)와 사용자 정보 또는 실패 이유(`reason`)를 포함합니다.
 *
 * @author       최준호
 * @update       2025.07.28
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { DecodedToken } from '@/app/_types/api';

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value;

  // 액세스 토큰이 없는 경우 (비로그인 사용자)
  if (!accessToken) {
    // 401 에러는 콘솔을 더럽히니 200 성공을 보내되,isLoggedIn: false로 응답합니다.
    return NextResponse.json(
      { isLoggedIn: false, reason: 'no_token', user: null },
      { status: 200 }
    );
  }

  try {
    // 토큰 유효성 검증
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as DecodedToken;

    // 토큰이 유효한 경우 (로그인 사용자)
    return NextResponse.json(
      {
        isLoggedIn: true,
        reason: null,
        user: {
          id: decoded.id,
          name: decoded.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // 토큰이 있지만 만료되었거나 유효하지 않은 경우
    // 이 경우에도 '로그인 안 됨' 상태를 담아 200 성공으로 응답합니다.
    return NextResponse.json(
      { isLoggedIn: false, reason: 'token_expired', user: null },
      { status: 200 }
    );
  }
}
