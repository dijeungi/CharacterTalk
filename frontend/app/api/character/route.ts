/**
 * @file         frontend/app/api/character/route.ts
 * @desc         캐릭터 목록을 조회하는 API
 *
 * @summary      캐릭터 목록 조회
 * @description  페이지네이션, 검색, 필터링, 정렬 기능을 포함하여 캐릭터 목록을 조회합니다.
 * @param        {NextRequest} request - 들어오는 요청 객체. 다양한 쿼리 파라미터를 포함할 수 있습니다.
 * @query        {string} [page='1'] - 조회할 페이지 번호
 * @query        {string} [limit='12'] - 페이지 당 캐릭터 수
 * @query        {string} [keyword] - 검색어 (캐릭터 이름 또는 한 줄 소개)
 * @query        {string} [genre] - 필터링할 장르
 * @query        {string} [target] - 필터링할 타겟
 * @query        {string} [sort='latest'] - 정렬 기준 ('latest' 또는 'popular')
 * @responses
 *   200: 캐릭터 목록과 페이지네이션 정보를 성공적으로 조회했습니다.
 *   500: 서버 내부 오류가 발생했습니다.
 *
 * @author       최준호
 * @update       2025.07.28
 */
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/_lib/PostgreSQL';
import { s3Client } from '@/app/_config/s3Client';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // 쿼리 파라미터에서 페이지네이션, 필터링, 정렬 값 가져오기
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const keyword = searchParams.get('keyword');
  const genre = searchParams.get('genre');
  const target = searchParams.get('target');
  const sort = searchParams.get('sort') || 'latest';

  const offset = (page - 1) * limit;

  const client = await pool.connect();
  try {
    // 동적으로 WHERE 절과 ORDER BY 절을 구성하기 위한 준비
    let whereClauses = ["c.visibility = 'public'", 'c.deleted_at IS NULL'];
    const queryParams: any[] = [];
    let paramIndex = 1;

    // 검색어 필터링
    if (keyword) {
      whereClauses.push(`(c.name ILIKE $${paramIndex} OR c.oneliner ILIKE $${paramIndex})`);
      queryParams.push(`%${keyword}%`);
      paramIndex++;
    }

    // 장르 필터링
    if (genre) {
      whereClauses.push(`c.genre = $${paramIndex}`);
      queryParams.push(genre);
      paramIndex++;
    }

    // 타겟 필터링
    if (target) {
      whereClauses.push(`c.target = $${paramIndex}`);
      queryParams.push(target);
      paramIndex++;
    }

    // 정렬 기준 설정
    let orderByClause = 'ORDER BY c.created_at DESC';
    if (sort === 'popular') {
      orderByClause = 'ORDER BY c.conversation_count DESC, c.created_at DESC';
    }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // 최종 데이터 조회 쿼리 (해시태그 부분은 성능을 위해 분리)
    const dataQuery = `
      SELECT
        c.id, c.code, c.name, c.profile_image_url, c.oneliner,
        c.genre, c.target, u.name as creator_name, c.conversation_count
      FROM characters c
      JOIN users u ON c.creator_id = u.id
      ${whereString}
      ${orderByClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
    `;

    // DB에서 캐릭터 목록을 먼저 가져옵니다.
    const dataResult = await client.query(dataQuery, [...queryParams, limit, offset]);
    const charactersFromDB = dataResult.rows;

    // 각 캐릭터의 이미지 파일 이름(Key)으로 임시 URL을 생성하고, 해시태그도 함께 조회합니다.
    const charactersWithDetails = await Promise.all(
      charactersFromDB.map(async char => {
        let signedUrl = null;
        // 이미지 URL 생성
        if (char.profile_image_url) {
          const getCommand = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: char.profile_image_url,
          });
          signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 300 });
        }

        // 해시태그 조회
        const hashtagQuery = `
          SELECT h.name FROM hashtags h
          JOIN character_hashtags ch ON h.id = ch.hashtag_id
          WHERE ch.character_id = $1
          ORDER BY h.character_count DESC, h.name;
        `;
        const hashtagResult = await client.query(hashtagQuery, [char.id]);
        const hashtags = hashtagResult.rows.map(row => row.name);

        return {
          ...char,
          profile_image_url: signedUrl,
          hashtags: hashtags,
        };
      })
    );

    // 전체 카운트 조회 쿼리
    const countQuery = `SELECT COUNT(*) FROM characters c ${whereString};`;
    const countResult = await client.query(countQuery, queryParams.slice(0, paramIndex - 1));
    const totalCharacters = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalCharacters / limit);

    return NextResponse.json({
      characters: charactersWithDetails,
      pagination: {
        currentPage: page,
        totalPages,
        totalCharacters,
        limit,
      },
    });
  } catch (error) {
    console.error('캐릭터 목록 조회 API 오류:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    client.release();
  }
}
