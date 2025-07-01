DROP TABLE IF EXISTS users;

-- uuid module
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,                                       -- 고유 식별자
    code UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),            -- 공개 식별자
    email VARCHAR(255) NOT NULL UNIQUE,                             -- 이메일
    name VARCHAR(100) NOT NULL,                                     -- 이름
    phone_number VARCHAR(20),                                       -- 휴대폰 번호
    birth_date DATE,                                                -- 생년월일
    gender CHAR(1),                                                 -- 성별
    oauth_provider VARCHAR(50),                                     -- 가입 형태 (예: google, kakao)
    is_verified BOOLEAN DEFAULT FALSE,                              -- 본인인증 여부
    role VARCHAR(20) NOT NULL DEFAULT 'user',                       -- 관리자 여부

    -- 상태 및 타임스탬프
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    refresh_token TEXT                                              -- 토큰 정보
);

-- updated_at 컬럼을 자동으로 갱신해주는 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- users 테이블에 트리거 적용
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
