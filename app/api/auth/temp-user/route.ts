// app/api/temp-user/route.ts

import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/Redis';

export async function GET(req: NextRequest) {
  const tempId = req.nextUrl.searchParams.get('tempId');
  if (!tempId) {
    return new NextResponse('tempId 누락', { status: 400 });
  }

  const data = await redis.get(`temp_user:${tempId}`);
  if (!data) {
    return new NextResponse('존재하지 않거나 만료된 tempId', { status: 404 });
  }

  return NextResponse.json(JSON.parse(data));
}
