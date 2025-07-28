/**
 * @file         frontend/app/api/auth/signup/route.ts
 * @desc         신규 사용자의 회원가입을 처리하는 API
 *
 * @summary      신규 회원가입
 * @description  사용자로부터 받은 정보를 검증하고, 데이터베이스에 새로운 사용자를 추가합니다.
 * @param        {NextRequest} req - 들어오는 요청 객체. body에 사용자 정보를 포함합니다.
 * @responses
 *   201: 회원가입에 성공했습니다.
 *   400: 필수 값이 누락되었거나 본인인증이 완료되지 않았습니다.
 *   409: 이미 가입된 이메일입니다.
 *   500: 서버 내부 오류가 발생했습니다.
 *
 * @author       최준호
 * @update       2025.07.28
 */

import { NextRequest, NextResponse } from 'next/server';

import { pool } from '@/app/_lib/PostgreSQL';

export async function POST(req: NextRequest) {
  try {
    const { email, oauth, name, gender, number, verified, birthDate } = await req.json();

    if (!email || !name || !gender || !number || !birthDate || verified !== true) {
      return NextResponse.json(
        { message: '필수 값이 누락되었거나 본인인증이 완료되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 이메일 중복 체크
    const existingUser = await pool.query('SELECT code FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ message: '이미 가입된 이메일입니다.' }, { status: 409 });
    }

    // 회원 데이터 저장
    await pool.query(
      `INSERT INTO users (
        oauth_provider, email, name, phone_number,
        birth_date, gender, is_verified, role
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      )`,
      [
        oauth, // $1: oauth_provider
        email, // $2: email
        name, // $3: name
        number, // $4: phone_number
        birthDate, // $5: birth_date
        gender, // $6: gender
        verified, // $7: is_verified
        'user', // $8: role (기본값 'user'로 설정)
      ]
    );

    return NextResponse.json({ message: '회원가입에 성공했습니다.' }, { status: 201 });
  } catch (error) {
    console.error('회원가입 API 오류:', error);
    return NextResponse.json({ message: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
