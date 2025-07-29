# 💬 캐릭톡 (CharacterTalk) - AI 캐릭터 채팅 서비스

**CharacterTalk**은 AI 캐릭터와 자유롭게 대화할 수 있는 **챗봇 서비스**입니다.  
사용자는 자신만의 캐릭터를 생성하고, 원하는 주제로 대화방을 만들어 AI와 상호작용할 수 있습니다.

***

## ✨ 주요 기능

### 🤖 AI 캐릭터 채팅
- OpenAI GPT 기반 자연스러운 대화
- 캐릭터별 개성과 성격 반영
- 실시간 타이핑 애니메이션
- 대화 히스토리 저장

### 🏷 캐릭터 생성

#### 1. 캐릭터 인적사항

- **캐릭터 이미지** (필수)
    - **이미지 업로드**: 사용자 업로드 이미지 또는 AI 생성 이미지.
    - **AI 이미지 생성**:
        - **프롬프트**: 자동 생성되는 예시 버튼.
        - **그림체 미리보기**: 다양한 그림체 미리보기.
        - **이미지 크기**:
            - 1:1 정사각형 (1024 x 1024)
            - 9:7 (1152 x 896)
            - 7:9 (986 x 1152)
            - 19:13 (1216 x 832)
            - 13:19 (832 x 1216)
            - 7:4 가로형 (1344 x 768)
            - 4:7 세로형 (768 x 1344)
            - 12:5 가로형 (1536 x 640)
            - 5:12 세로형 (640 x 1536)
        - **이미지 개수**: 1~3장 선택 가능.
- **캐릭터 이름** (필수)
- **설명** (최대 300자, 필수)
- **MBTI**

#### 2. 성격 및 기본 정보

- **캐릭터 주제** (필수)
- **캐릭터 세부 설명** (최대 3,000자, 필수)
    - 성격, 말투, 관계, 세계관 등 포함.
- **말투 스타일**:
    - 존댓말 / 정중함
    - 반말 / 친근함
    - 직설적 / 쿨한 말투
    - 명랑하고 밝은 말투
    - 츤데레 스타일
- **행동 제약 조건**:
    - 예: 욕설 금지, 감정적으로 대할 때도 침착하게 대응.
- **고급설정**:
    - **예시 대화** (최대 3개, `사용자:`와 `AI:` 형식)
        - 대화 미리보기 제공.

#### 3. 시작 설정 (다중 생성 가능)

- **시작 설정 제목** (필수)
- **첫 인사말** ~~(AI 자동 초안 제공)~~
- **시작 상황 설명**:
    - 배경, 세계관, 사용자 역할 등.
- **고급설정**:
    - **추천 답변** (최대 3개)

#### 4. **등록 설정**

- **장르 설정**: 로맨스, 판타지, SF, 일상, 시대, 기타
- **타겟 설정**: 남성향, 여성향, 전체
- **대화 형태**: 1:1 롤플레잉, 시뮬레이션
- **사용자 정보 필터**:
    - 초기 설정 (실시간 반영)
    - 고정 (대화 시작 시점)
- **해시태그**: 최대 10개
- **공개 범위**: 비공개, 전체 공개, 링크 공개
- **댓글 기능**: On / Off

***

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
