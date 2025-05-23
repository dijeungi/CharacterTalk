# Project idx - PostgreSQL 안켜지는 오류 수정 스크립트 입니다.

# command: ./init-db.sh

echo "1. .idx/data/postgres 폴더 삭제 중..."
rm -rf .idx/data/postgres

echo "2. PostgreSQL 재시작을 위해 devbox 서비스 실행"
devbox services up &>/dev/null &
sleep 5

echo "3. PostgreSQL 준비 대기..."
until psql -U user -d postgres -c '\l' &>/dev/null; do
  echo "[3-1] DB 연결 대기 중..."
  sleep 1
done

echo "4. DB 연결됨. againhello 데이터베이스 생성 중..."
psql -U user -d postgres -c "CREATE DATABASE againhello;" 2>/dev/null

echo "5. 완료: againhello 데이터베이스 생성됨"
echo "6. SQLTools에서 연결하세요 (user / againhello)"

echo "7. 기본 DB 구조 생성 중..."
echo "8. db/schema.sql 실행 중..."
if [ ! -f db/schema.sql ]; then
  echo "[!] db/schema.sql 파일이 없습니다. 생성을 먼저 해주세요."
  exit 1
fi
psql -U user -d againhello -f db/schema.sql