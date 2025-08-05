-- 확장 및 공용 함수 정의
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- updated_at 컬럼 자동 갱신 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';



-- users 테이블: 사용자 정보
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    code UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    birth_date DATE,
    gender CHAR(1),
    oauth_provider VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    refresh_token TEXT
);

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- characters 테이블: 캐릭터 정보
CREATE TABLE IF NOT EXISTS characters (
    id BIGSERIAL PRIMARY KEY,
    code UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    creator_id BIGINT NOT NULL,
    -- step 1
    name VARCHAR(20) NOT NULL,
    profile_image_url TEXT,
    oneliner VARCHAR(300) NOT NULL,
    mbti VARCHAR(4),
    -- step 2
    title VARCHAR(50) NOT NULL,
    prompt_detail TEXT NOT NULL,
    speech_style VARCHAR(50) NOT NULL,
    behavior_constraint TEXT,
    example_dialogs JSONB,
    -- step 3
    scenario_title VARCHAR(12) NOT NULL,
    scenario_greeting TEXT NOT NULL,
    scenario_situation TEXT NOT NULL,
    scenario_suggestions JSONB,
    -- step 4
    genre VARCHAR(20) NOT NULL,
    target VARCHAR(20) NOT NULL,
    conversation_type VARCHAR(20) NOT NULL,
    user_filter VARCHAR(20) NOT NULL DEFAULT 'initial',
    visibility VARCHAR(20) NOT NULL DEFAULT 'private',
    comments_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TRIGGER update_characters_updated_at
BEFORE UPDATE ON characters
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- 3. hashtags 테이블: 해시태그 정보
CREATE TABLE IF NOT EXISTS hashtags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    character_count INT NOT NULL DEFAULT 0
);

-- 4. character_hashtags 테이블: 캐릭터와 해시태그 연결
CREATE TABLE IF NOT EXISTS character_hashtags (
    character_id BIGINT NOT NULL,
    hashtag_id BIGINT NOT NULL,
    PRIMARY KEY (character_id, hashtag_id)
);


-- 외래 키(Foreign Key) 및 인덱스 설정
ALTER TABLE characters
ADD CONSTRAINT fk_characters_creator
FOREIGN KEY (creator_id) REFERENCES users(id)
ON DELETE SET NULL;

ALTER TABLE character_hashtags
ADD CONSTRAINT fk_character_hashtags_character
FOREIGN KEY (character_id) REFERENCES characters(id)
ON DELETE CASCADE;

ALTER TABLE character_hashtags
ADD CONSTRAINT fk_character_hashtags_hashtag
FOREIGN KEY (hashtag_id) REFERENCES hashtags(id)
ON DELETE CASCADE;

-- 성능 향상을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_characters_creator_id ON characters(creator_id);
CREATE INDEX IF NOT EXISTS idx_hashtags_name ON hashtags(name);
CREATE INDEX IF NOT EXISTS idx_character_hashtags_hashtag_id ON character_hashtags(hashtag_id);

-- 채팅내역 Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    character_id BIGINT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('user', 'ai')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 반응(Reaction) Table
CREATE TABLE IF NOT EXISTS reactions (
    id BIGSERIAL PRIMARY KEY,
    message_id BIGINT NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emoji VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (message_id, user_id, emoji)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id_character_id_created_at
ON chat_messages (user_id, character_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reactions_message_id
ON reactions(message_id);