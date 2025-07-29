# 💬 캐릭톡 (CharacterTalk) - AI 캐릭터 채팅 서비스

**CharacterTalk**은 AI 캐릭터와 자유롭게 대화할 수 있는 **챗봇 서비스**입니다.  
사용자는 자신만의 캐릭터를 생성하고, 원하는 주제로 대화방을 만들어 AI와 상호작용할 수 있습니다.

## ✨ 주요 기능

### 🤖 AI 캐릭터 채팅
- OpenAI GPT 기반 자연스러운 대화
- 캐릭터별 개성과 성격 반영
- 실시간 타이핑 애니메이션
- 대화 히스토리 저장

### 🏷 캐릭터 생성
- **1. 프로필 자동 생성**: 프롬프트 작성 후, 그림체 & 크기를 선택하면 생성이 됩니다.
- **2. 성격 및 기본 정보**: 주제, 세부 설명, 말투, 행동 제약 조건, 고급설정(예시 대화) 설정
- **3. 시작 설정**: 시작 설정 제목, 첫 인사말, 시작 상황 설명, 고급설정(추천 답변) 설정
- **마무리 등록 설정**: 장르 설정, 타겟 설정, 대화 형태, 사용자 정보 필터, 해시태그, 공개 범위, 댓글 기능 설정

## 🛠️ 기술 스택

### Frontend
- **Next.js 15.3.2**: 최신 버전 기능 활용
    - App Router 기반
- **TypeScript**: 타입 안전성 보장
- **CSS Module**: 클래스 이름 중복 방지

### Backend
- **Next.js**: FullStack 프레임워크
- **PostgreSQL**: 관계형 데이터베이스
- **OpenAI API**: Gemini 2.5 Pro Preview 06-05

### Infrastructure
- **Cloudflare R2**: 이미지 저장소
- **Cloudflare**: DNS 및 프록시

~~- **Vercel**: 프론트엔드 배포~~
~~- **AWS EC2**: 백엔드 서버~~

## 📁 프로젝트 구조

```
CharacterTalk/
├── frontend/                      # Next.js 풀스택
│   ├── app/                       
│   │   ├── (routes)/              # 라우트
│   │   ├── api/                   # 백엔드
│   │   ├── _apis/                 # API 서비스
│   │   ├── _components/           # 재사용 가능한 컴포넌트
│   │   ├── chat/                  # 채팅 관련 컴포넌트
│   │   ├── _hooks/                # 커스텀 훅
│   │   ├── _lib/                  # 라이브러리 파일
│   │   ├── _store/                # 상태 관리
│   │   ├── _styles/               # 스타일 파일
│   ├── public/                    
│   ├── middleware.ts              
│   ├── next.config.ts             
│   └── package.json              
├── backend/                       # Python 백엔드
│   ├── api                        
│   │   ├── services               # 비즈니스 로직
│   │   │   ├── __init__.py        # 서비스 초기화 파일
│   │   │   ├── ai_service.py      # AI 서비스 처리
│   │   │   └── r2_client.py       # R2 클라이언트 설정
│   │   ├── urls.py                # API URL 라우팅
│   │   └── views.py               # API 요청 처리
│   ├── config                     # 설정 파일
│   ├── utils                      # 유틸리티 함수
│   ├── .env                       # 환경 변수 설정
│   ├── manage.py                  # Django 관리 명령
│   └── requirements.txt           # Python 패키지 목록
└── README.md                      # 프로젝트 설명 파일
```

## 📄 코드 구조 및 문서화

모든 주요 코드 파일 상단에는 해당 파일의 목적과 기능을 명확히 설명하는 주석이 포함되어 있습니다.  
빠른 이해와 유지보수를 위해 각 파일마다 `@file`, `@desc`, `@author`,
`@update` 정보를 주석 블록으로 제공하고 있습니다.

## 🚀 빠른 시작 (개발환경: MacBook Pro 16 M4 Pro 48GB)

### 1. 저장소 클론
```bash
git clone https://github.com/dijeungi/CharacterTalk.git
```

### 2. DB 생성 (PostgreSQL 설치 필수)
```
cd CharacterTalk
./reset-db.sh
```

#### 만약 `reset-db.sh`가 작동하지 않는다면
`reset-db.sh` 파일 내에서 설정을 수정해야 할 수도 있습니다. 아래와 같이 `reset-db.sh` 파일의 설정을 수정하세요:

> **설정 수정**  
> 파일 내부에서 아래와 같은 설정을 찾고 수정합니다:
> 
> ```bash
> # --- config ---
> DB_USER="postgres"
> DB_NAME="charctertalk"
> SCHEMA_FILE="db/schema.sql"
> ```

### 3. 프론트엔드 환경 변수 설정  (`.env` 생성 및 `.env.example` 파일 참고):
```
NODE_ENV=development

# Frontend - API config
NEXT_PUBLIC_NEXT_API_URL=http://localhost:3000
NEXT_PUBLIC_PYTHON_API_URL=http://localhost:8000

# 카카오 OAuth
NEXT_PUBLIC_KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
NEXT_PUBLIC_KAKAO_REDIRECT_URI=http://localhost:3000/api/auth/callback/kakao
NEXT_PUBLIC_KAUTH_HOST=https://kauth.kakao.com

# JWT Secret
JWT_SECRET=
JWT_REFRESH_SECRET=

# FIREBASE
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
# NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:G-74MY5B2K40

# DB
POSTGRESQL_URL=
REDIS_URL=

# R2
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_ENDPOINT_URL=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

### 4. 프론트엔드 설정
```bash
cd frontend
sudo npm install
npm run dev
```

### 5. 백엔드 환경 변수 설정  (`.env` 생성 및 `.env.example` 파일 참고):
```
DEBUG=true

# HuggingFace
HUGGING_FACE_TOKEN=

# 장고 시크릿 키
SECRET_KEY=

# CloudFlare R2
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_ENDPOINT_URL=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

### 6. Python 개발환경 셋팅
https://github.com/conda-forge/miniforge 설치

```
conda create -n project python=3.12
conda activate project
pip install -r requirements.txt
python manage.py runserver
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 개발자
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/dijeungi">
        <img src="https://github.com/dijeungi.png" width="100px" style="border-radius: 50%;" />
      </a>
      <br />
      <b>최준호</b>
    </td>
  </tr>
</table>
