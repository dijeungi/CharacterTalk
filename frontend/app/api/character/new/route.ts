import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '@/app/_lib/PostgreSQL';
// 1단계에서 만든 커스텀 인증 함수를 import 합니다.
import { getUserIdFromRequest } from '@/app/_lib/auth';
import { s3Client } from '@/app/_config/s3Client';

// Zod를 사용한 유효성 검사 스키마
const characterSchema = z.object({
  name: z.string().min(1, '이름은 필수입니다.').max(20),
  oneliner: z.string().min(1, '한 줄 소개는 필수입니다.').max(300),
  mbti: z.string().length(4).optional(),
  title: z.string().min(1, '페르소나 제목은 필수입니다.').max(50),
  promptDetail: z.string().min(1, '상세 설정은 필수입니다.'),
  speechStyle: z.string().min(1, '말투는 필수입니다.').max(50),
  behaviorConstraint: z.string().optional(),
  exampleDialogs: z.any().optional(),
  scenarioTitle: z.string().min(1, '시나리오 제목은 필수입니다.').max(12),
  scenarioGreeting: z.string().min(1, '시나리오 인사는 필수입니다.'),
  scenarioSituation: z.string().min(1, '시나리오 상황은 필수입니다.'),
  scenarioSuggestions: z.any().optional(),
  genre: z.string().min(1, '장르는 필수입니다.'),
  target: z.string().min(1, '타겟은 필수입니다.'),
  conversationType: z.string().min(1, '대화 형태는 필수입니다.'),
  userFilter: z.string().default('initial'),
  visibility: z.string().default('private'),
  commentsEnabled: z.boolean().default(true),
  hashtags: z.array(z.string()).max(10, '해시태그는 최대 10개까지 가능합니다.'),
});

type CharacterData = z.infer<typeof characterSchema>;

export async function POST(request: NextRequest) {
  let creatorId: number;
  try {
    // --- 1. 인증 확인 ---
    // API의 가장 첫 부분에서 토큰을 검증하고 사용자 ID를 가져옵니다.
    // 실패하면 여기서 바로 401 에러를 반환하고 종료됩니다.
    creatorId = await getUserIdFromRequest(request);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '인증되지 않은 사용자입니다.' },
      { status: 401 }
    );
  }

  const client = await pool.connect();

  try {
    // --- 2. FormData 파싱 ---
    const formData = await request.formData();
    const characterDataString = formData.get('characterData') as string;
    const profileImageFile = formData.get('profileImage') as File | null;

    if (!characterDataString) {
      return NextResponse.json({ error: '캐릭터 데이터가 없습니다.' }, { status: 400 });
    }

    // --- 3. 데이터 유효성 검사 ---
    let characterData: CharacterData;
    try {
      const parsedData = JSON.parse(characterDataString);
      const dataToValidate = { ...parsedData, speechStyle: parsedData.speech };
      characterData = characterSchema.parse(dataToValidate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: '데이터 형식이 올바르지 않습니다.', details: error.errors },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: '잘못된 JSON 형식입니다.' }, { status: 400 });
    }

    // --- 4. 이미지 업로드 처리 ---
    let imageKeyForDB: string | null = null;
    if (profileImageFile) {
      try {
        const buffer = Buffer.from(await profileImageFile.arrayBuffer());
        // R2에 저장될 고유한 파일 이름(Key) 생성
        const imageKey = `characters/${uuidv4()}-${profileImageFile.name.replace(/\s+/g, '-')}`;

        const command = new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: imageKey,
          Body: buffer,
          ContentType: profileImageFile.type,
        });
        await s3Client.send(command);

        // 데이터베이스에는 전체 URL이 아닌, 이 파일 이름(Key)을 저장합니다.
        imageKeyForDB = imageKey;
      } catch (error) {
        console.error('R2 파일 업로드 실패:', error);
        return NextResponse.json({ error: '파일 업로드 중 오류가 발생했습니다.' }, { status: 500 });
      }
    }

    // --- 5. 데이터베이스 트랜잭션 ---
    await client.query('BEGIN');

    const characterInsertQuery = `
      INSERT INTO characters (
        creator_id, name, profile_image_url, oneliner, mbti, title, prompt_detail,
        speech_style, behavior_constraint, example_dialogs, scenario_title,
        scenario_greeting, scenario_situation, scenario_suggestions, genre, target,
        conversation_type, user_filter, visibility, comments_enabled, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, 'active')
      RETURNING id, code;
    `;
    const characterValues = [
      creatorId, // 인증을 통해 가져온 creatorId를 사용합니다.
      characterData.name,
      imageKeyForDB,
      characterData.oneliner,
      characterData.mbti,
      characterData.title,
      characterData.promptDetail,
      characterData.speechStyle,
      characterData.behaviorConstraint,
      JSON.stringify(characterData.exampleDialogs || {}),
      characterData.scenarioTitle,
      characterData.scenarioGreeting,
      characterData.scenarioSituation,
      JSON.stringify(characterData.scenarioSuggestions || []),
      characterData.genre,
      characterData.target,
      characterData.conversationType,
      characterData.userFilter,
      characterData.visibility,
      characterData.commentsEnabled,
    ];

    const characterResult = await client.query(characterInsertQuery, characterValues);
    const newCharacterId = characterResult.rows[0].id;
    const newCharacterCode = characterResult.rows[0].code;

    if (characterData.hashtags && characterData.hashtags.length > 0) {
      const uniqueHashtags = [...new Set(characterData.hashtags)];

      for (const tagName of uniqueHashtags) {
        // 해시태그가 없으면 생성, 있으면 ID 가져오기
        const upsertHashtagQuery = `
          WITH ins AS (INSERT INTO hashtags (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id)
          SELECT id FROM ins UNION ALL SELECT id FROM hashtags WHERE name = $1;`;
        const hashtagResult = await client.query(upsertHashtagQuery, [tagName]);
        const hashtagId = hashtagResult.rows[0].id;

        // 캐릭터와 해시태그 연결
        const linkHashtagQuery = `INSERT INTO character_hashtags (character_id, hashtag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`;
        await client.query(linkHashtagQuery, [newCharacterId, hashtagId]);

        // character_count +1 증가
        const updateCountQuery = `UPDATE hashtags SET character_count = character_count + 1 WHERE id = $1;`;
        await client.query(updateCountQuery, [hashtagId]);
      }
    }

    await client.query('COMMIT');

    return NextResponse.json(
      { message: '캐릭터가 성공적으로 생성되었습니다.', characterCode: newCharacterCode },
      { status: 201 }
    );
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('캐릭터 생성 API 오류:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    client.release();
  }
}
