import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return new NextResponse('access_token 없음', { status: 401 });
  }

  try {
    const payload = jwt.verify(accessToken, process.env.JWT_SECRET!);
    return NextResponse.json({ isLoggedIn: true, payload });
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return new NextResponse('access_token 만료', { status: 401 });
    }
    return new NextResponse('유효하지 않은 access_token', { status: 401 });
  }
}
