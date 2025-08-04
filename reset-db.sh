#!/bin/bash

# PostgreSQL 데이터베이스 초기화 스크립트
# 사용법:
# 1. PostgreSQL 서버 실행 확인
# 2. 밑에 config에 PostgreSQL 사용자 이름 입력 (기본값: postgres)
# 3. ./reset-db.sh 실행 (실행 권한 필요: chmod +x reset-db.sh)

set -euo pipefail

# --- config ---
DB_USER="postgres"
DB_NAME="charctertalk"
SCHEMA_FILE="db/schema.sql"

echo "1. PostgreSQL 서버 연결 확인 중 (User: $DB_USER)..."
until pg_isready -U "$DB_USER" -d postgres &>/dev/null; do
  echo "[1-1] DB 연결 대기 중..."
  sleep 1
done
echo "-> PostgreSQL 서버 연결 완료."

# --- 데이터베이스 초기화 ---
echo "2. 데이터베이스 '$DB_NAME'를 초기화합니다..."

# 기존 데이터베이스에 연결된 모든 세션을 강제 종료
echo "-> (1/4) 기존 '$DB_NAME' 데이터베이스의 모든 연결을 종료합니다."
psql -U "$DB_USER" -d postgres -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '$DB_NAME' AND pid <> pg_backend_pid();" > /dev/null

# 기존 데이터베이스 삭제
echo "-> (2/4) 기존 '$DB_NAME' 데이터베이스를 삭제합니다."
dropdb --if-exists -U "$DB_USER" "$DB_NAME"

# 새 데이터베이스 생성
echo "-> (3/4) 새 '$DB_NAME' 데이터베이스를 생성합니다."
createdb -U "$DB_USER" "$DB_NAME"

echo "-> (4/4) 데이터베이스 초기화 완료."

if [ ! -f "$SCHEMA_FILE" ]; then
  echo "[!] 오류: 스키마 파일 '$SCHEMA_FILE'을 찾을 수 없습니다."
  exit 1
fi

echo "4. 스키마 파일 '$SCHEMA_FILE'을 실행하여 테이블을 생성합니다..."
psql -U "$DB_USER" -d "$DB_NAME" -f "$SCHEMA_FILE" > /dev/null
echo "-> 스키마 적용 완료."

SEED_FILE="db/seed.sql"
if [ -f "$SEED_FILE" ]; then
  echo "5. 시드 파일 '$SEED_FILE'을 실행하여 초기 데이터를 추가합니다..."
  psql -U "$DB_USER" -d "$DB_NAME" -f "$SEED_FILE" > /dev/null
  echo "-> 시드 데이터 추가 완료."

  echo "6. users 테이블의 ID 시퀀스를 재설정합니다..."
  psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));" > /dev/null
  echo "-> 시퀀스 재설정 완료."
else
  echo "[!] 경고: 시드 파일 '$SEED_FILE'을 찾을 수 없어 초기 데이터 추가를 건너뜁니다."
fi

echo ""
echo "모든 작업이 성공적으로 완료되었습니다."
