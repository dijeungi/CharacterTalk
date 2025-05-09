import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "테스트 API 입니다." });
}
