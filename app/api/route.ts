import redis from "@/lib/Redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const tempId = req.nextUrl.searchParams.get("tempId");
  if (!tempId) {
    return new NextResponse("임시 ID가 없습니다.", { status: 400 });
  }

  try {
    const userData = await redis.get(`temp_user:${tempId}`);

    if (!userData) {
      return new NextResponse("해당 임시 ID의 정보가 없습니다.", {
        status: 404,
      });
    }

    return NextResponse.json(JSON.parse(userData));
  } catch (error) {
    console.error("[/api/auth/temp-user] Redis 조회 오류:", error);
    return new NextResponse("서버 오류", { status: 500 });
  }
}
