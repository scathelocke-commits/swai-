# 그라드패스 (GradPath) — 졸업요건 관리 인터랙티브 목업

> **주의: 교육용 인터랙티브 목업이다.** 단국대학교의 공식 서비스가 아니며, 대학 학사시스템과 연결되지 않는다. 모든 학점 기준, 과목명, 판정 결과 및 수강계획은 가상 데이터다. 실제 졸업 여부 판단 또는 수강신청 계획에 사용할 수 없다.

React + Next.js App Router + TypeScript + Tailwind CSS로 개발한 6개 화면의 모바일 중심 웹 목업이다. 별도의 Python FastAPI 프로젝트는 동일한 가상 JSON을 제공한다. 브라우저의 학적정보와 수강내역 입력은 localStorage에서 관리되며, **판정과 로드맵 데이터는 편집 내용으로 계산되지 않는다.**

## 1. 프로젝트 구성

```text
graduation-path-demo/
├── frontend/                       # Next.js + React + TypeScript + Tailwind CSS
│   ├── src/app/                     # 6개 페이지의 App Router 경로
│   │   ├── page.tsx                 # 홈 (/)
│   │   ├── profile/page.tsx         # 학적정보 설정 (/profile)
│   │   ├── requirements/page.tsx    # 가상 졸업요건 조회 (/requirements)
│   │   ├── courses/page.tsx         # 수강내역 CRUD (/courses)
│   │   ├── analysis/page.tsx        # 분석 시나리오 (/analysis)
│   │   └── roadmap/page.tsx         # 가상 수강 로드맵 (/roadmap)
│   ├── src/components/              # 공통 UI·화면·반응형 앱 셸
│   ├── src/context/demo-context.tsx # 데모 상태·브라우저 저장·API 연결
│   ├── src/data/demo.json           # 프론트엔드 내장 폴백 데이터
│   ├── src/lib/                     # 타입/유틸리티
│   ├── scripts/                     # JSON 무결성 및 구조 검사
│   ├── .env.local.example
│   ├── package.json
│   └── vercel.json
├── backend/                        # FastAPI — 읽기 전용 가상 JSON API
│   ├── app.py                       # 배포 엔트리포인트
│   ├── data/demo.json              # API 기준 가상 데이터
│   ├── tests/test_api.py            # API 테스트
│   ├── requirements.txt
│   └── vercel.json
└── docs/
    ├── FEATURE_MATRIX.md           # 목업과 실기능 구분표
    └── TEST_CHECKLIST.md           # 시연 및 동작 점검 절차
```

## 2. 사전 준비

- Node.js 20.9 이상, npm
- Python 3.10 이상 권장(로컬 실행 기준)
- npm 레지스트리와 Python 패키지 저장소에 접속 가능한 인터넷 환경(최초 의존성 설치 시)

## 3. 로컬에서 실행 — 터미널 2개

### A. Python FastAPI 서버

프로젝트 최상위 폴더에서 실행한다.

**Windows PowerShell**

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

**macOS / Linux**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

API 정상 작동 확인: http://127.0.0.1:8000/api/health (`ok: true`, `demo: true` 반환). API 문서: http://127.0.0.1:8000/docs.

### B. Next.js 프론트엔드

새 터미널에서 프로젝트 최상위 폴더를 기준으로 실행한다.

**Windows PowerShell**

```powershell
cd frontend
Copy-Item .env.local.example .env.local
npm install
npm run dev
```

**macOS / Linux**

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

브라우저에서 http://localhost:3000 에 접속한다. `.env.local`의 `NEXT_PUBLIC_DEMO_API_URL` 기본값은 `http://127.0.0.1:8000`이다. 브라우저에 보이는 데모 API 상태 표시가 **데모 API 연결됨**이면 실제 Python 서버에서 JSON을 읽는 중이다.

**백엔드를 실행하지 않아도** 프론트엔드는 `frontend/src/data/demo.json`을 사용하여 독립적으로 작동하도록 설계하였다. 이때 표시 상태는 `내장 데모 데이터 사용`이다. 다만 이 경우 API 연동 시연은 아니다.

## 4. 화면과 실제 작동 내용

| 화면 | 경로 | 실제 작동하는 기능 | 목업으로만 존재하는 기능 |
|---|---|---|---|
| 홈 | `/` | 화면 이동, 진행률 표현 | 졸업 진행 수치는 고정 시나리오 |
| 학적정보 | `/profile` | 입학연도·학과 등 입력/저장·복원·초기화 | 정보 변경에 따른 규정 재조회 |
| 졸업요건 | `/requirements` | 카드 조회, 필수과목 영역 확장 | 가상 규정의 실제 적용 판정 |
| 수강내역 | `/courses` | 추가/수정/삭제, 검색, 필터, 유효성 검사, 저장 | 실제 수강내역 연동 및 이수 판정 |
| 졸업분석 | `/analysis` | 3개 시나리오 전환, 상세 펼치기 | 결과 수치는 저장된 가상 예시 |
| 로드맵 | `/roadmap` | 시나리오별 계획 전환, 학기 선택/펼치기 | 자동 추천 및 수강 가능성 검증 |

로컬 저장소에는 **시연용으로 입력한 학적정보 및 교과목 목록**만 저장된다. Python 서버에는 편집 데이터가 전송되거나 저장되지 않는다.

## 5. API 명세

| 메서드 | 경로 | 반환 |
|---|---|---|
| GET | `/api/health` | 서버 상태 및 데모 표시 |
| GET | `/api/demo` | 프론트엔드에서 사용하는 전체 가상 JSON |
| GET | `/api/student` | 예시 학생정보 |
| GET | `/api/requirements` | 가상 졸업규정 |
| GET | `/api/courses` | 예시 교과목 카탈로그 |
| GET | `/api/analysis` | 3개 고정 분석 시나리오 |
| GET | `/api/analysis/{scenario_id}` | 선택 시나리오 (`partial`, `course`, `complete`) |
| GET | `/api/roadmap` | 3개 고정 로드맵 |
| GET | `/api/roadmap/{scenario_id}` | 선택 로드맵 |

`/api/health`를 제외한 모든 API는 `{ "demo": true, "disclaimer": "...", "data": ... }` 응답 형태를 사용한다. 백엔드에 쓰기/계산 엔드포인트는 존재하지 않는다.

## 6. Vercel 배포 — 같은 Git 저장소를 두 프로젝트로 배포

이 구성에서는 **Vercel 프로젝트를 두 개** 만든다. 하나는 `backend/`를 루트 디렉터리로 하는 Python FastAPI 프로젝트, 다른 하나는 `frontend/`를 루트 디렉터리로 하는 Next.js 프로젝트다. Vercel의 일반적인 모노레포 배포 절차를 따른다.

1. 프로젝트 최상위 폴더 내용을 GitHub 저장소에 업로드한다.
2. Vercel의 **Add New > Project > Import Git Repository**로 저장소를 선택한다.
3. 먼저 백엔드를 배포한다. **Root Directory = `backend`**, **Framework Preset = FastAPI**를 선택한다. `backend/app.py`가 ASGI 진입점이다. 배포 후 `https://<api-project>.vercel.app/api/health`가 정상 응답하는지 확인한다.
4. 같은 저장소에서 Vercel 프로젝트를 하나 더 생성한다. **Root Directory = `frontend`**, **Framework Preset = Next.js**를 선택한다.
5. 프론트엔드 프로젝트의 **Environment Variables**에 `NEXT_PUBLIC_DEMO_API_URL`=`https://<api-project>.vercel.app`을 지정한다. URL 마지막의 `/`는 없어도 되며, 코드는 둘 다 허용한다.
6. 프론트엔드를 배포한다. 브라우저에서 6개 경로와 홈의 `데모 API 연결됨` 여부를 확인한다. 환경변수를 수정한 경우 프론트엔드를 **재배포**한다.

> 참고: Vercel 배포는 계정·GitHub 연결 및 외부 서비스 접근이 필요하므로 이 ZIP에 실제 배포 URL은 포함되지 않는다. Vercel의 서비스 구성이나 플랜에 따라 설정 화면이 바뀔 수 있으므로 최신 공식 문서를 함께 확인한다.

공식 참고 문서:
- https://vercel.com/docs/monorepos
- https://vercel.com/docs/frameworks/backend/fastapi
- https://vercel.com/docs/project-configuration/vercel-json
- https://nextjs.org/docs/app/getting-started/installation

## 7. 테스트

**Python API** (백엔드에 의존성 설치 후):

```bash
cd backend
python -m pip install pytest httpx
python -m pytest -q
```

**JSON 일관성 및 기본 파일 구조** (프론트엔드 의존성 설치 없이 Node.js만으로 실행):

```bash
cd frontend
npm test
```

**프론트엔드 프로덕션 빌드** (npm 설치 필요):

```bash
cd frontend
npm install
npm run build
```

브라우저 수동 테스트 항목은 [`docs/TEST_CHECKLIST.md`](docs/TEST_CHECKLIST.md)를 참조한다.

## 8. 데이터 수정 시 주의사항

백엔드 기준 파일은 `backend/data/demo.json`이고, API 서버를 실행하지 않을 때 사용할 내장 데이터 복사본은 `frontend/src/data/demo.json`이다. **JSON을 수정한다면 두 파일을 동일하게 맞춰야 한다.** `npm run test:demo`는 총 130학점 분해, 시나리오 합계, 부족학점 및 로드맵과 데이터 복사본 일치를 검증한다.

고정 판정 값과 수강내역 CRUD 기능의 독립성은 의도된 것이다. 실제 졸업요건 계산 엔진을 개발하게 되면 API, 규칙 데이터, 검증 근거와 프론트엔드 상태 관리를 별도로 설계해야 한다.

## 9. 비공식 프로젝트 안내

`그라드패스`는 시연용 임시 서비스 명칭이며 단국대학교와 관련된 공식 브랜드나 인증 서비스를 뜻하지 않는다. 모든 학생정보는 가상이며, 서비스 이용에 실제 계정이나 개인정보가 필요하지 않다.

### 선택: Playwright 브라우저 자동화 테스트

```bash
cd frontend
npm install
npx playwright install chromium
npm run test:e2e
```

모바일 Pixel 7 환경과 데스크톱 Chromium 환경에서 화면 이동, 학적정보 저장, 수강내역 CRUD, 분석 시나리오와 로드맵 상호작용을 검사하도록 테스트 코드를 포함하였다. 최초 Chromium 설치 시 다운로드가 필요하다. **현재 제공 환경에서는 npm 의존성을 설치할 수 없어 이 자동화 테스트를 실행하지 못했다.**
