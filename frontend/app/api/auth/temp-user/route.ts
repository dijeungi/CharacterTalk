/**
 * @file         frontend/app/api/auth/temp-user/route.ts
 * @desc         임시 사용자 정보를 조회하는 API
 *
 * @summary      임시 사용자 정보 조회
 * @description  Redis에 저장된 임시 사용자 정보를 `tempId`를 이용해 조회합니다.
 * @param        {NextRequest} req - 들어오는 요청 객체. 'tempId' 쿼리 파라미터를 포함합니다.
 * @responses
 *   200: 임시 사용자 정보를 성공적으로 조회했습니다.
 *   400: 'tempId' 쿼리 파라미터가 누락되었습니다.
 *   404: 존재하지 않거나 만료된 'tempId' 입니다.
 *
 * @author       최준호
 * @update       2025.07.28
 */

import { NextRequest, NextResponse } from 'next/server';
import redis from '@/app/_lib/Redis';

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
