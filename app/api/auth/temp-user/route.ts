import { pool } from "@/lib/PostgreSQL";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const tempId = req.nextUrl.searchParams.get("tempId");
  if (!tempId) {
    return new NextResponse("임시 ID가 없습니다.", { status: 400 });
  }

  try {
    const result = await pool.query(
      "SELECT email, full_name FROM temp_users WHERE temp_id = $1",
      [tempId]
    );

    if (result.rows.length === 0) {
      return new NextResponse("해당 임시 ID의 정보가 없습니다.", {
        status: 404,
      });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("[/api/auth/temp-user] DB 조회 오류:", error);
    return new NextResponse("서버 오류", { status: 500 });
  }
}
