import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    if (!code)
      return new NextResponse("Authorization code 없음", { status: 400 });

    // 1. 카카오에서 accessToken 요청
    const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
        redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
        code,
        client_secret: process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET!,
      }),
    });

    const tokenData = await tokenRes.json();
    const kakaoAccessToken = tokenData.access_token;

    if (!kakaoAccessToken) {
      return new NextResponse("토큰 발급 실패", { status: 401 });
    }

    // 2. 카카오 사용자 정보 요청
    const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    });
    const kakaoUser = await userRes.json();

    // 3. DB에서 이메일 조회
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      kakaoUser.kakao_account.email,
    ]);
    const user = result.rows[0];

    if (!user) {
      // 첫 로그인 시 임시 데이터 저장소에 정보 저장
      const tempId = uuidv4();
      await pool.query(
        "INSERT INTO temp_users (temp_id, email, full_name) VALUES ($1, $2, $3)",
        [tempId, kakaoUser.kakao_account.email, kakaoUser.properties?.nickname]
      );
      return NextResponse.redirect(
        `${req.nextUrl.origin}/auth/signup?tempId=${tempId}`
      );
    }

    // 기존 로그인
    const refreshToken = jwt.sign(
      { id: kakaoUser.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );
    const accessToken = jwt.sign(
      { id: kakaoUser.id },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" }
    );

    // 쿠키에 저장
    const response = new NextResponse("로그인 완료");
    response.cookies.set({
      name: "access_token",
      value: accessToken,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    response.cookies.set({
      name: "refresh_token",
      value: refreshToken,
      path: "/api/auth/refresh",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // 리다이렉트 처리 (서버에서 직접 리다이렉트)
    return NextResponse.redirect(`${req.nextUrl.origin}/`);
  } catch (error) {
    console.error("[!] Kakao OAuth 실패:", error);
    return new NextResponse("서버 오류", { status: 500 });
  }
}
