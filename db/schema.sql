DROP TABLE IF EXISTS users;

-- User (로그인 & 회원가입)
CREATE TABLE IF NOT EXISTS users (
    code BIGSERIAL PRIMARY KEY,                          -- 고유 식별자
    oauth VARCHAR(50),                                   -- 가입 형태 (예: google, kakao)
    email VARCHAR(50) UNIQUE NOT NULL,                   -- 이메일
    gender CHAR(1) CHECK (gender IN ('M', 'F')),         -- 성별 M 또는 F만 허용
    full_name VARCHAR(50) NOT NULL,                      -- 이름
    number VARCHAR(20) NOT NULL,                         -- 전화번호
    admin BOOLEAN NOT NULL,                              -- 관리자 여부
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- 생성 날짜
    last_login TIMESTAMP,                                -- 마지막 로그인 시간
    refresh_token TEXT                                   -- Refresh Token
);
