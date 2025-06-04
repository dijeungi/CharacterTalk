// import { NextRequest, NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';

// export async function GET(req: NextRequest) {
//   const accessToken = req.cookies.get('access_token')?.value;

//   // access_token 없으면 비회원 처리
//   if (!accessToken) {
//     return NextResponse.json({ isLoggedIn: false, user: null }, { status: 200 });
//   }

//   try {
//     const payload = jwt.verify(accessToken, process.env.JWT_SECRET!);
//     return NextResponse.json({ isLoggedIn: true, payload });
//   } catch {
//     return new NextResponse('access_token 만료 또는 유효하지 않음', { status: 401 });
//   }
// }
