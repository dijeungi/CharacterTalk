import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../lib/PostgreSQL';

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      oauth,
      fullName,
      gender,
      number,
      residentFront,
      residentBack,
      verified,
      birthDate,
    } = await req.json();

    if (
      !email ||
      !fullName ||
      !gender ||
      !number ||
      !residentFront ||
      !residentBack ||
      !birthDate ||
      verified !== true
    ) {
      return NextResponse.json({ message: '필수 값 누락 또는 미인증' }, { status: 400 });
    }

    // 이메일 중복 체크
    const existingUser = await pool.query('SELECT code FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ message: '이미 존재하는 이메일입니다.' }, { status: 409 });
    }

    // 회원 데이터 저장
    await pool.query(
      `INSERT INTO users (
        oauth, email, gender, full_name, number,
        rrn_front, rrn_back, birth_date, verified,
        admin, status, is_deleted
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12
      )`,
      [
        oauth,
        email,
        gender,
        fullName,
        number,
        residentFront,
        residentBack,
        birthDate,
        true,
        false,
        'active',
        false,
      ]
    );

    return NextResponse.json({ message: '회원가입 성공' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}
