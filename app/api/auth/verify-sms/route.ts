import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/Redis";

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, code } = await req.json();

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { message: "전화번호와 인증번호가 필요합니다." },
        { status: 400 }
      );
    }

    const savedCode = await redis.get(`verify_code:${phoneNumber}`);

    if (!savedCode) {
      return NextResponse.json(
        { message: "인증번호가 만료되었거나 존재하지 않습니다." },
        { status: 400 }
      );
    }

    if (savedCode !== code) {
      return NextResponse.json(
        { message: "인증번호가 일치하지 않습니다." },
        { status: 400 }
      );
    }

    // 인증 성공: 인증번호 Redis에서 삭제
    await redis.del(`verify_code:${phoneNumber}`);

    // ✅ 인증 성공 기록 추가 (10분 유효)
    await redis.set(`verified:${phoneNumber}`, "true", "EX", 600);

    return NextResponse.json({ message: "인증 성공" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "인증 실패" }, { status: 500 });
  }
}
