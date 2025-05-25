#!/bin/bash

set -euo pipefail

echo "1. PostgreSQL 서버 연결 확인 중..."
until pg_isready -U user -d postgres &>/dev/null; do
  echo "[1-1] DB 연결 대기 중..."
  sleep 1
done

echo "2. DB 연결됨. againhello 데이터베이스 존재 여부 확인..."
if ! psql -U user -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='againhello'" | grep -q 1; then
  echo "3. againhello DB 생성 중..."
  createdb -U user againhello
  echo "4. 완료: againhello DB 생성됨"
else
  echo "3. againhello DB가 이미 존재합니다."
fi

if [ ! -f db/schema.sql ]; then
  echo "[!] 오류: db/schema.sql 파일이 존재하지 않습니다."
  exit 1
fi

echo "5. 스키마 파일 실행 중..."
psql -U user -d againhello -f db/schema.sql

echo "모든 작업이 완료되었습니다."
