import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

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
        user: { id: decoded.id },
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
