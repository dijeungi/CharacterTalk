DROP TABLE IF EXISTS users;

-- User (로그인 & 회원가입)
CREATE TABLE IF NOT EXISTS users (
    code BIGSERIAL PRIMARY KEY,                          -- 고유 식별자
    oauth VARCHAR(50),                                   -- 가입 형태 (예: google, kakao)
    email VARCHAR(50) UNIQUE NOT NULL,                   -- 이메일
    name VARCHAR(50) NOT NULL,                           -- 이름
    rrn_front CHAR(6) NOT NULL,                          -- 주민등록번호 앞자리 (생년월일)
    rrn_back CHAR(1) NOT NULL,                           -- 주민등록번호 뒷자리 첫 글자
    gender CHAR(1),                                      -- 성별 (M/F 등)
    birth_date DATE,                                     -- 생년월일
    number VARCHAR(20) NOT NULL,                         -- 전화번호
    verified BOOLEAN DEFAULT FALSE,                      -- 본인인증 여부
    admin BOOLEAN NOT NULL,                              -- 관리자 여부
    status VARCHAR(20) DEFAULT 'active',                 -- 회원 상태 (active, suspended, deleted 등)
    is_deleted BOOLEAN DEFAULT FALSE,                    -- 탈퇴 여부 (soft delete)
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- 생성 날짜
    last_login TIMESTAMP,                                -- 마지막 로그인 시간
    refresh_token TEXT                                   -- Refresh Token
);
