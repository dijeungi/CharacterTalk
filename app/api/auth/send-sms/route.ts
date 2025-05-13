import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";
import redis from "@/lib/Redis";

const API_KEY = process.env.COOLSMS_API_KEY!;
const API_SECRET = process.env.COOLSMS_SECRET!;
const SENDER_NUMBER = process.env.COOLSMS_SENDER_NUMBER!;

function generateSignature(date: string, salt: string) {
  const data = date + salt;
  return crypto.createHmac("sha256", API_SECRET).update(data).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { message: "전화번호가 필요합니다." },
        { status: 400 }
      );
    }

    // Rate limit 체크
    const rateLimitKey = `rate_limit:${phoneNumber}`;
    const isLimited = await redis.exists(rateLimitKey);
    if (isLimited) {
      return NextResponse.json(
        { message: "1분 후 다시 시도하세요." },
        { status: 429 }
      );
    }
    await redis.set(rateLimitKey, "1", "EX", 60);

    // 인증번호 생성
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const date = new Date().toISOString();
    const salt = crypto.randomBytes(16).toString("hex");
    const signature = generateSignature(date, salt);

    const headers = {
      Authorization: `HMAC-SHA256 apiKey=${API_KEY}, date=${date}, salt=${salt}, signature=${signature}`,
      "Content-Type": "application/json",
    };

    const body = {
      message: {
        to: phoneNumber,
        from: SENDER_NUMBER,
        text: `인증번호는 [${verificationCode}] 입니다.`,
      },
    };

    await axios.post("https://api.coolsms.co.kr/messages/v4/send", body, {
      headers,
    });

    // Redis에 인증번호 저장 (5분 유효)
    await redis.set(`verify_code:${phoneNumber}`, verificationCode, "EX", 300);

    return NextResponse.json(
      { message: "문자가 전송되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "문자 전송 실패" }, { status: 500 });
  }
}
