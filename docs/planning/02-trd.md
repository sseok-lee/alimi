# TRD (기술 요구사항 정의서)

> 개발자/AI 코딩 파트너가 참조하는 기술 문서입니다.
> 기술 표현을 사용하되, "왜 이 선택인지"를 함께 설명합니다.

---

## MVP 캡슐

| # | 항목 | 내용 |
|---|------|------|
| 1 | 목표 | 국민 누구나 공공데이터 기반으로 맞춤형 지원금을 쉽게 찾을 수 있는 서비스 제공 |
| 2 | 페르소나 | 모든 연령층 (학생, 직장인, 프리랜서, 주부, 은퇴자 등) |
| 3 | 핵심 기능 | FEAT-1: 나이/소득/지역 입력 맞춤형 지원금 매칭 |
| 4 | 성공 지표 (노스스타) | 월 애드센스 수익 목표 달성 |
| 5 | 입력 지표 | 일 방문자 수(DAU), 검색 전환율 |
| 6 | 비기능 요구 | SEO 최적화 (구글 검색 노출), 페이지 로딩 속도 < 3초 |
| 7 | Out-of-scope | 소셜 로그인, 이메일 알림, 복잡한 필터링은 v2 이후 |
| 8 | Top 리스크 | 공공데이터 API 불안정 또는 데이터 품질 문제 |
| 9 | 완화/실험 | 여러 공공 API 소스 통합, 데이터 캐싱 전략 수립 |
| 10 | 다음 단계 | Phase 0 계약 정의 및 테스트 케이스 작성 시작 |

---

## 1. 시스템 아키텍처

### 1.1 고수준 아키텍처

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Client         │────▶│   Server         │────▶│  Database        │
│  (Vue + Nuxt)    │     │  (Express)       │     │  (MySQL)         │
│  - SSR/SSG       │     │  - API Gateway   │     │                  │
│  - SEO 최적화    │     │  - 공공 API 연동 │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                 │
                                 ▼
                         ┌──────────────────┐
                         │  External APIs   │
                         │  - 보조금24 API  │
                         │  - 지자체 API    │
                         └──────────────────┘
```

### 1.2 컴포넌트 설명

| 컴포넌트 | 역할 | 왜 이 선택? |
|----------|------|-------------|
| Frontend (Nuxt) | SSR/SSG로 페이지 사전 렌더링, SEO 최적화 | 애드센스 수익을 위해 구글 검색 노출이 필수이므로 SSR 지원 프레임워크 필요 |
| Backend (Express) | 공공 API 호출, 데이터 가공, 조건 매칭 로직 | TypeScript로 프론트엔드와 타입 공유, 비동기 지원으로 여러 API 병렬 호출 가능 |
| Database (MySQL) | 지원금 데이터, 메타데이터 저장 | 관계형 DB로 복잡한 조건 필터링(나이/소득/지역) 최적화 |
| External APIs | 보조금24, 지자체 공공 API | 실시간 최신 데이터 확보 |

---

## 2. 권장 기술 스택

### 2.1 프론트엔드

| 항목 | 선택 | 이유 | 벤더 락인 리스크 |
|------|------|------|-----------------|
| 프레임워크 | Vue 3 + Nuxt 3 | SSR/SSG 지원으로 SEO 최적화 필수, Vue는 학습 곡선이 낮음 | 낮음 (React로 이동 가능) |
| 언어 | TypeScript | 타입 안정성, API 계약 명확화 | 낮음 |
| 스타일링 | TailwindCSS | 빠른 개발, 일관된 디자인 시스템 구축 용이 | 낮음 |
| 상태관리 | Pinia | Vue 3 공식 상태관리, 간단한 API | 낮음 |
| HTTP 클라이언트 | Axios | 널리 사용, 인터셉터로 에러 처리 용이 | 낮음 |

### 2.2 백엔드

| 항목 | 선택 | 이유 | 벤더 락인 리스크 |
|------|------|------|-----------------|
| 프레임워크 | Express | Node.js 표준 프레임워크, 경량, 유연한 미들웨어 구조 | 낮음 |
| 언어 | TypeScript 5.0+ | 프론트엔드와 타입 공유, 타입 안정성 | - |
| ORM | Prisma | 타입 안전, 자동 생성 클라이언트, 마이그레이션 지원 | 낮음 |
| 검증 | Zod | TypeScript 퍼스트, 스키마 추론으로 타입 자동 생성 | 낮음 |
| HTTP 클라이언트 | Axios | 널리 사용, 인터셉터로 에러 처리 용이, 비동기 지원 | 낮음 |

### 2.3 데이터베이스

| 항목 | 선택 | 이유 |
|------|------|------|
| 메인 DB | MySQL 8.0+ | 관계형 DB로 복잡한 조건 쿼리 최적화, 무료 호스팅 지원 |
| 캐시 | Redis (선택) | v2에서 API 응답 캐싱으로 속도 개선 |

### 2.4 인프라

| 항목 | 선택 | 이유 |
|------|------|------|
| 컨테이너 | Docker + Docker Compose | 로컬 개발 환경 일관성 (MySQL) |
| 호스팅 | Cafe24 가상서버 호스팅 | Ubuntu, Node.js, MySQL, Nginx 모두 설치 가능 |
| 웹서버 | Nginx | 리버스 프록시, 정적 파일 서빙, SSL 지원 |
| 프로세스 관리 | PM2 | Node.js 프로세스 관리, 자동 재시작, 로그 관리 |
| CI/CD | GitHub Actions | 자동 빌드 및 배포, SSH로 서버 연결 |

### 2.5 CI/CD 파이프라인

**배포 플로우:**
```
Git Push (main) → GitHub Actions → Build → SSH Deploy → PM2 Restart
```

**GitHub Actions 워크플로우:**
1. **Checkout code**: 소스코드 체크아웃
2. **Setup Node.js**: Node.js 20 환경 설정
3. **Build Backend**: Express 빌드 (`npm run build`)
4. **Build Frontend**: Nuxt SSR 빌드 (`npm run build`)
5. **Deploy to Server**: SCP로 빌드 파일 전송
6. **Restart Services**: PM2로 프로세스 재시작

**서버 구성:**
- **IP**: 183.111.126.54
- **OS**: Ubuntu/Debian
- **백엔드**: PM2로 Express 실행 (포트 8000)
- **프론트엔드**: PM2로 Nuxt 실행 (포트 3000)
- **Nginx**: 포트 80으로 프록시 (API → 8000, 나머지 → 3000)

**환경변수 관리:**
- 로컬: `.env` 파일
- 서버: `/home/project1/alimi/backend/.env`
- GitHub: Secrets (SSH 키, 서버 정보)

---

## 3. 비기능 요구사항

### 3.1 성능

| 항목 | 요구사항 | 측정 방법 |
|------|----------|----------|
| 응답 시간 | < 500ms (P95) | Express 미들웨어, API 모니터링 |
| 초기 로딩 (FCP) | < 3s | Lighthouse, Google PageSpeed Insights |
| SEO 점수 | ≥ 90 | Lighthouse SEO 점수 |

### 3.2 보안

| 항목 | 요구사항 |
|------|----------|
| 인증 | MVP에서는 불필요 (익명 검색), v2에서 JWT + Refresh Token |
| 비밀번호 | bcrypt 해싱 (v2에서 적용) |
| HTTPS | 필수 (Vercel/Railway 기본 제공) |
| 입력 검증 | 서버 측 Zod validation 필수 |
| CORS | 프론트엔드 도메인만 허용 |

### 3.3 확장성

| 항목 | 현재 | 목표 |
|------|------|------|
| 동시 사용자 | MVP: 100명 | v2: 1,000명 |
| 데이터 용량 | MVP: 1GB | v2: 10GB |
| API 캐싱 | v2에서 Redis 도입 | 응답 시간 50% 개선 |

---

## 4. 외부 API 연동

### 4.1 공공 API

| 서비스 | 용도 | 필수/선택 | 연동 방식 |
|--------|------|----------|----------|
| 보조금24 API | 중앙정부 지원금 데이터 | 필수 | REST API (공공데이터포털) |
| 서울시 복지포털 API | 서울시 지자체 지원금 | 선택 (v2) | REST API |
| 경기도 복지포털 API | 경기도 지자체 지원금 | 선택 (v2) | REST API |

#### 4.1.1 보조금24 API 상세 (MVP 필수)

**제공 기관**: 행정안전부
**API 포털**: [공공데이터포털](https://www.data.go.kr/data/15113968/openapi.do)
**Base URL**: `https://api.odcloud.kr/api`
**인증 방식**: API Key (serviceKey 파라미터)
**응답 형식**: JSON / XML
**API 키 상태**: ✅ 발급 완료

**주요 엔드포인트**:
1. `/gov24/v3/serviceList` - 공공서비스 목록 조회
   - 페이징 지원 (page, perPage)
   - 검색 필터: 서비스명, 소관기관, 서비스분야
2. `/gov24/v3/serviceDetail` - 서비스 상세내용
   - 구비서류, 문의처 등 상세 정보
3. `/gov24/v3/supportConditions` - 지원조건
   - 나이, 소득, 지역, 성별 등 조건 정보

**데이터 동기화 전략**:
- **방식**: 주기적 DB 동기화 (크론잡)
- **주기**: 매일 새벽 2시
- **이유**: API 호출 제한 회피, 빠른 응답 속도
- **구현**: `backend/src/services/syncBenefits.ts`

**Rate Limiting**:
- 요청 간 1초 대기
- 타임아웃: 10초
- 에러 시 재시도: 3회

**참고 문서**: `docs/planning/08-api-integration.md`

### 4.2 기타 서비스

| 서비스 | 용도 | 필수/선택 | 비고 |
|--------|------|----------|------|
| Google Analytics | 트래픽 분석, DAU 측정 | 필수 | GA4 |
| Google AdSense | 광고 수익 창출 | 필수 | 승인 후 적용 |

---

## 5. 접근제어·권한 모델

### 5.1 역할 정의

MVP에서는 사용자 구분 없이 모든 방문자가 동일한 권한을 가집니다.

| 역할 | 설명 | 권한 |
|------|------|------|
| Guest | 모든 방문자 | 검색, 결과 조회 |

### 5.2 권한 매트릭스

| 리소스 | Guest |
|--------|-------|
| 지원금 검색 | O |
| 결과 조회 | O |

---

## 6. 데이터 생명주기

### 6.1 원칙

- **최소 수집**: 나이/소득/지역만 수집 (세션 기반, DB 저장 안 함)
- **명시적 동의**: 개인정보 수집 없음
- **보존 기한**: 세션 종료 시 즉시 삭제

### 6.2 데이터 흐름

```
입력 (나이/소득/지역) → API 호출 → 필터링 → 결과 반환 → 세션 종료 시 삭제
```

| 데이터 유형 | 보존 기간 | 삭제/익명화 |
|------------|----------|------------|
| 검색 조건 (나이/소득/지역) | 세션 종료 시 | 즉시 삭제 |
| 공공 API 캐시 | 24시간 | 자동 갱신 |
| 분석 데이터 (GA) | 영구 | 익명화된 상태로 보관 |

---

## 7. 테스트 전략 (Contract-First TDD)

### 7.1 개발 방식: Contract-First Development

본 프로젝트는 **계약 우선 개발(Contract-First Development)** 방식을 채택합니다.
BE/FE가 독립적으로 병렬 개발하면서도 통합 시 호환성을 보장합니다.

```
┌─────────────────────────────────────────────────────────────┐
│                    Contract-First 흐름                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 계약 정의 (Phase 0)                                     │
│     ├─ API 계약: contracts/*.contract.ts                   │
│     ├─ BE 스키마: backend/src/schemas/*.ts                 │
│     └─ 타입 동기화: TypeScript ↔ Zod                       │
│                                                             │
│  2. 테스트 선행 작성 (🔴 RED)                               │
│     ├─ BE 테스트: backend/src/__tests__/**/*.test.ts       │
│     ├─ FE 테스트: frontend/src/__tests__/**/*.test.ts      │
│     └─ 모든 테스트가 실패하는 상태 (정상!)                  │
│                                                             │
│  3. Mock 생성 (FE 독립 개발용)                              │
│     └─ MSW 핸들러: src/mocks/handlers/*.ts                 │
│                                                             │
│  4. 병렬 구현 (🔴→🟢)                                       │
│     ├─ BE: 테스트 통과 목표로 구현                          │
│     └─ FE: Mock API로 개발 → 나중에 실제 API 연결          │
│                                                             │
│  5. 통합 검증                                               │
│     └─ Mock 제거 → E2E 테스트                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 테스트 피라미드

| 레벨 | 도구 | 커버리지 목표 | 위치 |
|------|------|-------------|------|
| Unit | Vitest | ≥ 80% | backend/src/__tests__/, frontend/src/__tests__/ |
| Integration | Vitest + MSW + Supertest | Critical paths | backend/src/__tests__/integration/ |
| E2E | Playwright | Key user flows | e2e/ |

### 7.3 테스트 도구

**백엔드:**
| 도구 | 용도 |
|------|------|
| Vitest | 테스트 실행 |
| Supertest | API 엔드포인트 테스트 |
| @faker-js/faker | 테스트 데이터 생성 |
| @vitest/coverage-v8 | 커버리지 측정 |

**프론트엔드:**
| 도구 | 용도 |
|------|------|
| Vitest | 테스트 실행 |
| Vue Testing Library | 컴포넌트 테스트 |
| MSW (Mock Service Worker) | API 모킹 |
| Playwright | E2E 테스트 |

### 7.4 계약 파일 구조

```
project/
├── contracts/                    # API 계약 (BE/FE 공유)
│   ├── types.ts                 # 공통 타입 정의
│   └── benefits.contract.ts     # 지원금 검색 API 계약
│
├── backend/
│   ├── src/
│   │   ├── schemas/             # Zod 스키마 (계약과 동기화)
│   │   │   └── benefit.ts
│   │   └── __tests__/
│   │       └── api/             # API 테스트 (계약 기반)
│   │           └── benefits.test.ts
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── mocks/
    │   │   ├── handlers/        # MSW Mock 핸들러
    │   │   │   └── benefits.ts
    │   │   └── data/            # Mock 데이터
    │   └── __tests__/
    │       └── api/             # API 테스트 (계약 기반)
    └── e2e/                     # E2E 테스트
```

### 7.5 TDD 사이클

모든 기능 개발은 다음 사이클을 따릅니다:

```
🔴 RED    → 실패하는 테스트 먼저 작성 (Phase 0에서 완료)
🟢 GREEN  → 테스트를 통과하는 최소한의 코드 구현
🔵 REFACTOR → 테스트 통과 유지하며 코드 개선
```

### 7.6 품질 게이트

**병합 전 필수 통과:**
- [ ] 모든 단위 테스트 통과
- [ ] 커버리지 ≥ 80%
- [ ] 린트 통과 (ESLint)
- [ ] 타입 체크 통과 (tsc)
- [ ] E2E 테스트 통과 (해당 기능)

**검증 명령어:**
```bash
# 백엔드
cd backend && npm run test -- --coverage
cd backend && npm run lint
cd backend && npm run type-check

# 프론트엔드
cd frontend && npm run test -- --coverage
cd frontend && npm run lint
cd frontend && npm run type-check

# E2E
npx playwright test
```

---

## 8. API 설계 원칙

### 8.1 RESTful 규칙

| 메서드 | 용도 | 예시 |
|--------|------|------|
| GET | 조회 | GET /api/v1/benefits/search?age=27&income=0&region=서울 |
| POST | 생성 | POST /api/v1/benefits/search (body로 조건 전달) |

### 8.2 응답 형식

**성공 응답:**
```json
{
  "data": [
    {
      "id": "benefit-001",
      "name": "청년도약계좌",
      "category": "금융지원",
      "estimated_amount": "5000만원 (5년 후)",
      "description": "청년의 자산 형성을 지원하는 적금 상품",
      "eligibility": ["19~34세", "연소득 7,500만원 이하"],
      "link": "https://www.gov.kr/..."
    }
  ],
  "meta": {
    "total": 3,
    "matched": 3
  }
}
```

**에러 응답:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "나이는 필수 입력 항목입니다.",
    "details": [
      { "field": "age", "message": "나이를 입력하세요 (0-150)" }
    ]
  }
}
```

### 8.3 API 버저닝

| 방식 | 예시 | 채택 여부 |
|------|------|----------|
| URL 경로 | /api/v1/benefits | 권장 |

---

## 9. 병렬 개발 지원 (Git Worktree)

### 9.1 개요

BE/FE를 완전히 독립된 환경에서 병렬 개발할 때 Git Worktree를 사용합니다.

### 9.2 Worktree 구조

```
~/projects/
├── welfare-notifier/          # 메인 (main 브랜치)
├── welfare-notifier-search-be/  # Worktree: feature/search-be
└── welfare-notifier-search-fe/  # Worktree: feature/search-fe
```

### 9.3 명령어

```bash
# Worktree 생성
git worktree add ../welfare-notifier-search-be -b feature/search-be
git worktree add ../welfare-notifier-search-fe -b feature/search-fe

# 각 Worktree에서 독립 작업
cd ../welfare-notifier-search-be && npm run test -- src/__tests__/api/search.test.ts
cd ../welfare-notifier-search-fe && npm run test -- src/__tests__/search/

# 테스트 통과 후 병합
git checkout main
git merge --no-ff feature/search-be
git merge --no-ff feature/search-fe

# Worktree 정리
git worktree remove ../welfare-notifier-search-be
git worktree remove ../welfare-notifier-search-fe
```

### 9.4 병합 규칙

| 조건 | 병합 가능 |
|------|----------|
| 단위 테스트 통과 (🟢) | 필수 |
| 커버리지 ≥ 80% | 필수 |
| 린트/타입 체크 통과 | 필수 |
| E2E 테스트 통과 | 권장 |

---

## Decision Log 참조

| ID | 항목 | 선택 | 이유 |
|----|------|------|------|
| D-07 | 백엔드 프레임워크 | Express | TypeScript, 경량, 프론트엔드와 언어 통일 |
| D-08 | 프론트엔드 프레임워크 | Vue + Nuxt | SSR/SSG 지원, SEO 최적화 필수 |
| D-09 | 데이터베이스 | MySQL | 관계형, 복잡한 조건 필터링 최적 |
| D-10 | 테스트 전략 | Contract-First TDD | BE/FE 병렬 개발, 통합 충돌 최소화 |
| D-11 | 호스팅 | Cafe24 가상서버 호스팅 | 전체 제어 가능, MySQL/Nginx 포함, 장기 운영 |
| D-12 | 웹서버 | Nginx | 리버스 프록시, 성능, SSL 지원 |
| D-13 | 프로세스 관리 | PM2 | 자동 재시작, 로그 관리, 무중단 배포 |
| D-14 | CI/CD | GitHub Actions | 무료, GitHub 통합, SSH 배포 가능 |
| D-15 | ORM | Prisma | 타입 안전, 자동 생성 클라이언트, 마이그레이션 |
| D-16 | 검증 라이브러리 | Zod | TypeScript 퍼스트, 스키마에서 타입 추론 |
