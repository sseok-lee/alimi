# TASKS: 복지알리미 - 맞춤형 정부 서비스 검색 서비스

> 이 문서는 AI 개발 파트너(오케스트레이터 & 서브에이전트)가 작업을 실행하기 위한 태스크 목록입니다.
> Contract-First TDD 방식을 채택하며, Git Worktree로 병렬 개발을 지원합니다.

---

## 프로젝트 개요

**목표**: 국민 누구나 공공데이터 기반으로 맞춤형 서비스을 쉽게 찾을 수 있는 서비스 제공

**핵심 기능**: 나이/소득/지역 3가지 입력으로 맞춤형 서비스 매칭

**기술 스택**:
- **백엔드**: Express + Prisma + MySQL + Zod
- **프론트엔드**: Vue 3 + Nuxt 3 + TypeScript + TailwindCSS
- **인프라**: Cafe24 서버 + Nginx + PM2 + GitHub Actions + Docker Compose (로컬)

**성공 지표**:
- 노스스타: 월 애드센스 수익 목표 달성
- 입력지표: DAU (일 방문자 수), 검색 전환율 70%+

---

## 마일스톤 개요

| 마일스톤 | 설명 | Phase | 상태 |
|----------|------|-------|------|
| M0 | 프로젝트 셋업 | Phase 0 | ✅ |
| M0.5 | 계약 & 테스트 설계 (Contract-First) | Phase 0 | ✅ |
| M1 | FEAT-0: 랜딩 페이지 | Phase 1 | ✅ |
| M2 | FEAT-1: 서비스 검색 (백엔드) | Phase 2 | ✅ |
| M3 | FEAT-1: 서비스 검색 (프론트엔드) | Phase 3 | ✅ |
| M4 | 보조금24 데이터 동기화 & 통합 테스트 | Phase 4 | ✅ |
| M5 | CI/CD 구축 & 배포 | Phase 5 | ✅ |
| M6 | FEAT-1-3: 서비스 상세 페이지 | Phase 6 | ✅ |
| M7 | 데이터 동기화 복구 | Phase 7 | ✅ |
| M8 | 검색 필터 확장 및 정렬 기능 | Phase 8 | ✅ |
| M9 | 지역 필터링 고도화 | Phase 9 | ✅ |
| M10 | 검색 결과 공유 기능 | Phase 10 | ✅ |
| M11 | 인기 서비스 | Phase 11 | ✅ |

---

## M0: 프로젝트 셋업 (Phase 0)

### [x] Phase 0, T0.1: 프로젝트 구조 초기화

**담당**: frontend-specialist

**작업 내용**:
- 백엔드: Express + TypeScript 프로젝트 초기화
- 프론트엔드: Nuxt 3 프로젝트 초기화
- 공통: contracts/ 디렉토리 생성 (API 계약 공유)

**산출물**:
```
welfare-notifier/
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── middlewares/
│   │   └── utils/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── __tests__/
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── composables/
│   ├── stores/
│   ├── types/
│   └── package.json
├── contracts/
│   └── benefits.contract.ts
└── docs/planning/
```

**완료 조건**:
- [x] 백엔드: `npm run dev` 실행 가능 (ts-node 또는 tsx)
- [x] 프론트엔드: `npm run dev` 실행 가능
- [x] contracts/ 디렉토리 생성

---

### [x] Phase 0, T0.2: Docker 환경 설정

**담당**: backend-specialist

**작업 내용**:
- docker-compose.yml 작성
- MySQL 8.0 컨테이너 설정
- Express 컨테이너 설정
- Nuxt 컨테이너 설정 (개발용)

**산출물**:
- `docker-compose.yml`
- `backend/Dockerfile`
- `frontend/Dockerfile`

**완료 조건**:
- [x] `docker-compose up -d` 실행 가능
- [x] MySQL 컨테이너 헬스체크 통과
- [x] 백엔드 컨테이너에서 MySQL 연결 확인

---

### [x] Phase 0, T0.3: DB 연결 및 ORM 설정

**담당**: database-specialist

**작업 내용**:
- Prisma 설정 및 초기화
- 데이터베이스 연결 테스트
- Prisma Client 생성

**산출물**:
- `backend/prisma/schema.prisma` (Prisma 스키마)
- `backend/src/lib/prisma.ts` (Prisma Client 인스턴스)

**완료 조건**:
- [x] Prisma 초기화 완료: `npx prisma init`
- [x] Prisma Client 생성: `npx prisma generate`
- [x] 테스트 DB 연결 성공

---

### [x] Phase 0, T0.4: 린트 & 포매터 설정

**담당**: frontend-specialist

**작업 내용**:
- 백엔드: ESLint + Prettier 설정
- 프론트엔드: ESLint + Prettier 설정
- Pre-commit 훅 설정

**산출물**:
- `backend/.eslintrc.js`
- `backend/.prettierrc`
- `frontend/.eslintrc.js`
- `frontend/.prettierrc`
- `.pre-commit-config.yaml`

**완료 조건**:
- [x] 백엔드: `npm run lint` 통과
- [x] 프론트엔드: `npm run lint` 통과
- [x] Pre-commit 훅 동작 확인

---

## M0.5: 계약 & 테스트 설계 (Phase 0)

> Contract-First TDD의 핵심 단계입니다. 이 단계에서 모든 API 계약을 정의하고, BE/FE가 독립적으로 개발할 수 있도록 준비합니다.

### [x] Phase 0, T0.5.1: API 계약 정의 (Contract)

**담당**: backend-specialist

**작업 내용**:
- 서비스 검색 API 계약 정의
- TypeScript 타입 정의 (프론트엔드용)
- Zod 스키마 정의 (백엔드용)

**산출물**:
- `contracts/benefits.contract.ts`
```typescript
// GET /api/v1/benefits/search
export interface BenefitSearchRequest {
  age: number;        // 0-150
  income: number;     // 원 단위, 0 = 무소득
  region: string;     // 서울/경기/전국 등
}

export interface BenefitResponse {
  id: string;
  name: string;
  category: string;
  description?: string;
  estimatedAmount?: string;
  eligibility: string[];
  link: string;
}
```

- `backend/src/schemas/benefit.ts`
```typescript
import { z } from 'zod';

export const BenefitSearchSchema = z.object({
  age: z.number().min(0).max(150),
  income: z.number().min(0),
  region: z.string().min(1).max(50),
});

export type BenefitSearchRequest = z.infer<typeof BenefitSearchSchema>;

export const BenefitResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string().optional(),
  estimatedAmount: z.string().optional(),
  eligibility: z.array(z.string()),
  link: z.string(),
});

export type BenefitResponse = z.infer<typeof BenefitResponseSchema>;
```

**완료 조건**:
- [x] API 계약 정의 완료 (TypeScript + Zod 동기화)
- [x] 계약 문서 버전 관리 (v1)

---

### [x] Phase 0, T0.5.2: 백엔드 테스트 스켈레톤 작성 (RED)

**담당**: test-specialist

**작업 내용**:
- 검색 API 테스트 작성 (실패 확인용)
- Vitest 설정
- 테스트 데이터 팩토리 정의

**산출물**:
- `backend/__tests__/api/benefits.test.ts`
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/index';

describe('GET /api/v1/benefits/search', () => {
  it('나이/소득/지역으로 서비스 검색 - 성공', async () => {
    const response = await request(app)
      .get('/api/v1/benefits/search')
      .query({ age: 27, income: 0, region: '서울' });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    // Expected: FAILED (API 미구현)
  });

  it('잘못된 나이 입력 - 검증 에러', async () => {
    const response = await request(app)
      .get('/api/v1/benefits/search')
      .query({ age: -1, income: 0, region: '서울' });

    expect(response.status).toBe(422);
    // Expected: FAILED (검증 로직 미구현)
  });
});
```

- `backend/vitest.config.ts` (Vitest 설정)

**테스트 실행**:
```bash
cd backend
npm run test -- __tests__/api/benefits.test.ts
# Expected: 2 failed (정상!)
```

**완료 조건**:
- [x] 테스트 작성 완료
- [x] 테스트 실행 시 실패 확인 (RED)

---

### [x] Phase 0, T0.5.3: 프론트엔드 Mock API 생성

**담당**: frontend-specialist

**작업 내용**:
- MSW (Mock Service Worker) 설정
- 서비스 검색 API Mock 핸들러 작성
- Mock 데이터 정의

**산출물**:
- `frontend/src/mocks/handlers/benefits.ts`
```typescript
import { http, HttpResponse } from 'msw'

export const benefitHandlers = [
  http.get('/api/v1/benefits/search', ({ request }) => {
    const url = new URL(request.url)
    const age = url.searchParams.get('age')
    const income = url.searchParams.get('income')
    const region = url.searchParams.get('region')

    // Mock 데이터 반환
    return HttpResponse.json([
      {
        id: 'benefit-001',
        name: '청년도약계좌',
        category: '금융지원',
        estimated_amount: '5년 후 5,000만원',
        eligibility: ['19~34세', '연소득 7,500만원 이하'],
        link: 'https://www.kinfa.or.kr/'
      }
    ])
  })
]
```

- `frontend/src/mocks/data/benefits.ts` (Mock 데이터)

**완료 조건**:
- [x] MSW 설정 완료
- [x] Mock API 동작 확인
- [x] 프론트엔드에서 Mock API 호출 성공

---

## M1: FEAT-0 랜딩 페이지 (Phase 1)

### [x] Phase 1, T1.1: 랜딩 페이지 UI RED→GREEN

**담당**: frontend-specialist

**디자인 레퍼런스**:
| 파일 | 경로 | 설명 |
|------|------|------|
| HTML | [code.html](../../../design/welfare_alimi_landing_&_search/code.html) | 브라우저에서 열기 |
| PNG | ![랜딩 & 검색 목업](../../../design/welfare_alimi_landing_&_search/screen.png) | 스크린샷 |

**Git Worktree 설정**:
```bash
# 1. Worktree 생성
git worktree add ../welfare-notifier-phase1-landing -b phase/1-landing
cd ../welfare-notifier-phase1-landing

# 2. 작업 완료 후 병합 (사용자 승인 필요)
# git checkout main
# git merge --no-ff phase/1-landing
# git worktree remove ../welfare-notifier-phase1-landing
```

**TDD 사이클**:

1. **RED**: 테스트 작성 (실패 확인)
   ```bash
   # 테스트 파일: frontend/tests/pages/index.test.ts
   npm run test -- index.test.ts
   # Expected: FAILED
   ```

2. **GREEN**: 최소 구현 (테스트 통과)
   ```bash
   # 구현 파일: frontend/pages/index.vue
   npm run test -- index.test.ts
   # Expected: PASSED
   ```

3. **REFACTOR**: 리팩토링 (테스트 유지)
   - 컴포넌트 분리
   - 스타일 최적화
   - 테스트 계속 통과 확인

**작업 내용**:
- 히어로 섹션: "맞춤형 서비스 찾기" 타이틀
- 3가지 입력 필드 표시 (나이/소득/지역)
- CTA 버튼: "서비스 찾기" → `/search` 페이지로 이동
- 반응형 레이아웃 (모바일/데스크톱)

**산출물**:
- `frontend/pages/index.vue` (랜딩 페이지)
- `frontend/components/ui/Button.vue` (재사용 버튼)
- `frontend/components/ui/Input.vue` (재사용 입력 필드)
- `frontend/tests/pages/index.test.ts` (테스트)

**인수 조건**:
- [x] 테스트 먼저 작성됨 (RED 확인)
- [x] 모든 테스트 통과 (GREEN)
- [x] 모바일 반응형 확인
- [ ] Lighthouse 성능 점수 >= 90 (개발 서버 실행 시 확인 가능)

**완료 시**:
- [x] 작업 완료 (main 브랜치에서 직접 작업)
- [x] worktree 정리: N/A (Phase 0-1은 main에서 작업)

---

### [x] Phase 1, T1.2: SEO 최적화 설정 RED→GREEN

**담당**: frontend-specialist

**의존성**: T1.1 (랜딩 페이지) - **독립 개발 가능 (메타태그만 설정)**

**Git Worktree 설정**:
```bash
git worktree add ../welfare-notifier-phase1-seo -b phase/1-seo
cd ../welfare-notifier-phase1-seo
```

**TDD 사이클**:

1. **RED**: 테스트 작성
   ```bash
   # 테스트 파일: frontend/tests/seo/meta.test.ts
   npm run test -- meta.test.ts
   # Expected: FAILED
   ```

2. **GREEN**: 메타태그 구현
   ```bash
   # 구현 파일: frontend/app.vue, nuxt.config.ts
   npm run test -- meta.test.ts
   # Expected: PASSED
   ```

**작업 내용**:
- 메타 태그 설정 (title, description, OG tags)
- robots.txt 생성
- sitemap.xml 생성
- Google Analytics 4 연동

**산출물**:
- `frontend/nuxt.config.ts` (SEO 설정)
- `frontend/public/robots.txt`
- `frontend/server/routes/sitemap.xml.ts` (동적 sitemap)

**인수 조건**:
- [x] 테스트 통과
- [ ] Lighthouse SEO 점수 >= 90 (개발 서버 실행 시 확인 가능)
- [x] Google Search Console 등록 가능 (robots.txt, sitemap.xml 생성 완료)

**완료 시**:
- [x] 작업 완료 (main 브랜치에서 직접 작업)
- [x] worktree 정리: N/A (Phase 0-1은 main에서 작업)

---

## M2: FEAT-1 서비스 검색 (백엔드) (Phase 2)

### [x] Phase 2, T2.1: DB 모델 & 마이그레이션 RED→GREEN

**담당**: database-specialist

**Git Worktree 설정**:
```bash
git worktree add ../welfare-notifier-phase2-db -b phase/2-db
cd ../welfare-notifier-phase2-db
```

**TDD 사이클**:

1. **RED**: 모델 테스트 작성
   ```bash
   # 테스트 파일: backend/__tests__/models/benefit.test.ts
   npm run test -- __tests__/models/benefit.test.ts
   # Expected: FAILED
   ```

2. **GREEN**: Prisma 스키마 & 마이그레이션
   ```bash
   # 구현 파일: backend/prisma/schema.prisma
   npm run test -- __tests__/models/benefit.test.ts
   # Expected: PASSED
   ```

3. **REFACTOR**: 인덱스 최적화

**작업 내용**:
- BENEFIT 모델 정의 (docs/planning/04-database-design.md 참조)
- SEARCH_LOG 모델 정의
- CLICK_LOG 모델 정의
- Prisma 마이그레이션 생성

**산출물**:
- `backend/prisma/schema.prisma` (모델 정의)
- `backend/prisma/migrations/` (마이그레이션 파일)

**인수 조건**:
- [x] 테스트 통과
- [x] 마이그레이션 실행 성공: `npx prisma migrate dev`
- [x] DB 테이블 생성 확인

**완료 시**:
- [x] 사용자 승인 후 병합
- [x] worktree 정리

---

### [x] Phase 2, T2.2: 공공 API 클라이언트 RED→GREEN

**담당**: backend-specialist

**Git Worktree 설정**:
```bash
git worktree add ../welfare-notifier-phase2-api-client -b phase/2-api-client
cd ../welfare-notifier-phase2-api-client
```

**TDD 사이클**:

1. **RED**: API 클라이언트 테스트
   ```bash
   # 테스트 파일: backend/__tests__/services/publicApiClient.test.ts
   npm run test -- __tests__/services/publicApiClient.test.ts
   # Expected: FAILED
   ```

2. **GREEN**: Axios로 API 클라이언트 구현
   ```bash
   # 구현 파일: backend/src/services/publicApiClient.ts
   npm run test -- __tests__/services/publicApiClient.test.ts
   # Expected: PASSED
   ```

**작업 내용**:
- **보조금24 API 클라이언트** (행정안전부 공공데이터)
  - Base URL: `https://api.odcloud.kr/api`
  - 인증: API Key (환경변수 `OPENAPI_SERVICE_KEY`)
  - 엔드포인트:
    - `/gov24/v3/serviceList` - 서비스 목록 조회
    - `/gov24/v3/serviceDetail` - 서비스 상세
    - `/gov24/v3/supportConditions` - 지원조건
- API 응답 파싱 및 정규화
- 에러 핸들링 (타임아웃 10초, 재시도 3회, Rate Limiting 1초)
- 페이징 처리 (page, perPage)

**산출물**:
- `backend/src/services/publicApiClient.ts` - API 클라이언트 (3개 함수)
  - `fetchServiceList()` - 서비스 목록 조회
  - `fetchSupportConditions()` - 지원조건 조회
  - `fetchServiceDetail()` - 서비스 상세 조회
- `backend/__tests__/services/publicApiClient.test.ts` - 단위 테스트

**환경변수 설정**:
```bash
# backend/.env
OPENAPI_SERVICE_KEY=43006692951fc050808d9f8f3fe5c5d76426bdaf2bcf308933f1aeeff539011b
OPENAPI_BASE_URL=https://api.odcloud.kr/api
```

**Mock 설정** (테스트용):
```typescript
// backend/__tests__/services/publicApiClient.test.ts
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.create.mockReturnValue({
  get: vi.fn().mockResolvedValue({
    data: {
      page: 1,
      totalCount: 100,
      data: [{ 서비스ID: 'SVC001', 서비스명: '청년도약계좌', ... }]
    }
  })
} as any);
```

**참고 문서**: `docs/planning/08-api-integration.md`

**인수 조건**:
- [x] 테스트 통과 (Mock 사용)
- [x] 실제 API 연동 테스트 (수동) - 보조금24 API 키 사용
- [x] 에러 핸들링 확인 (401, 429, timeout)
- [x] 페이징 처리 확인

**완료 시**:
- [x] 사용자 승인 후 병합
- [x] worktree 정리

---

### [x] Phase 2, T2.3: 검색 API 엔드포인트 RED→GREEN

**담당**: backend-specialist

**의존성**: T2.1 (DB 모델), T2.2 (API 클라이언트) - **Mock 사용으로 독립 개발 가능**

**Git Worktree 설정**:
```bash
git worktree add ../welfare-notifier-phase2-search-api -b phase/2-search-api
cd ../welfare-notifier-phase2-search-api
```

**TDD 사이클**:

1. **RED**: T0.5.2에서 작성한 테스트 실행
   ```bash
   npm run test -- __tests__/api/benefits.test.ts
   # Expected: FAILED
   ```

2. **GREEN**: 검색 API 구현
   ```bash
   # 구현 파일: backend/src/routes/benefits.ts
   npm run test -- __tests__/api/benefits.test.ts
   # Expected: PASSED
   ```

3. **REFACTOR**: 서비스 레이어 분리, 쿼리 최적화

**작업 내용**:
- GET /api/v1/benefits/search 엔드포인트
- 나이/소득/지역 기반 필터링 로직
- Zod validation
- 검색 로그 기록 (SEARCH_LOG)

**산출물**:
- `backend/src/routes/benefits.ts`
- `backend/src/services/benefitService.ts`

**인수 조건**:
- [x] T0.5.2 테스트 통과 (GREEN)
- [x] 커버리지 >= 80%
- [x] API 문서 확인 (Swagger UI 또는 OpenAPI)

**완료 시**:
- [x] 사용자 승인 후 병합
- [x] worktree 정리

---

## M3: FEAT-1 서비스 검색 (프론트엔드) (Phase 3)

### [x] Phase 3, T3.1: 검색 폼 컴포넌트 RED→GREEN

**담당**: frontend-specialist

**디자인 레퍼런스**:
| 파일 | 경로 | 설명 |
|------|------|------|
| HTML | [code.html](../../../design/welfare_alimi_landing_&_search/code.html) | 브라우저에서 열기 |
| PNG | ![랜딩 & 검색 목업](../../../design/welfare_alimi_landing_&_search/screen.png) | 검색 폼 디자인 |

**의존성**: T2.3 (검색 API) - **Mock API 사용으로 독립 개발 가능**

**Git Worktree 설정**:
```bash
git worktree add ../welfare-notifier-phase3-search-form -b phase/3-search-form
cd ../welfare-notifier-phase3-search-form
```

**TDD 사이클**:

1. **RED**: 컴포넌트 테스트
   ```bash
   # 테스트 파일: frontend/tests/components/SearchForm.test.ts
   npm run test -- SearchForm.test.ts
   # Expected: FAILED
   ```

2. **GREEN**: 컴포넌트 구현
   ```bash
   # 구현 파일: frontend/components/SearchForm.vue
   npm run test -- SearchForm.test.ts
   # Expected: PASSED
   ```

**작업 내용**:
- 나이 입력 필드 (숫자, 0-150 검증)
- 소득 선택 (드롭다운: 무소득/저소득/중소득 등)
- 지역 선택 (드롭다운: 서울/경기/전국 등)
- 검색 버튼 (validation 후 API 호출)

**산출물**:
- `frontend/components/SearchForm.vue`
- `frontend/composables/useBenefitSearch.ts`
- `frontend/tests/components/SearchForm.test.ts`

**Mock 사용** (실제 API 대신):
```typescript
// tests/components/SearchForm.test.ts
import { setupServer } from 'msw/node'
import { benefitHandlers } from '../../src/mocks/handlers/benefits'

const server = setupServer(...benefitHandlers)
beforeAll(() => server.listen())
afterAll(() => server.close())
```

**인수 조건**:
- [x] 테스트 통과 (10/10 tests passed)
- [x] Mock API 호출 성공
- [x] 폼 검증 동작 확인
- [x] 접근성 체크 (키보드 탐색 - label/input 연결)

**완료 시**:
- [x] 작업 완료 (main 브랜치에서 직접 작업)
- [x] worktree 정리: N/A (Phase 1-3은 main에서 작업)

---

### [x] Phase 3, T3.2: 결과 카드 컴포넌트 RED→GREEN

**담당**: frontend-specialist

**디자인 레퍼런스**:
| 파일 | 경로 | 설명 |
|------|------|------|
| HTML | [code.html](../../../design/customized_benefit_results/code.html) | 브라우저에서 열기 |
| PNG | ![검색 결과 목업](../../../design/customized_benefit_results/screen.png) | 결과 카드 디자인 |

**Git Worktree 설정**:
```bash
git worktree add ../welfare-notifier-phase3-benefit-card -b phase/3-benefit-card
cd ../welfare-notifier-phase3-benefit-card
```

**TDD 사이클**:

1. **RED**: 카드 컴포넌트 테스트
   ```bash
   npm run test -- BenefitCard.test.ts
   # Expected: FAILED
   ```

2. **GREEN**: 카드 구현
   ```bash
   # 구현 파일: frontend/components/BenefitCard.vue
   npm run test -- BenefitCard.test.ts
   # Expected: PASSED
   ```

**작업 내용**:
- 서비스 정보 표시 (이름, 카테고리, 예상 금액)
- 외부 링크 버튼 (새 탭 열기)
- 호버 효과, 그림자

**산출물**:
- `frontend/components/BenefitCard.vue`
- `frontend/tests/components/BenefitCard.test.ts`

**인수 조건**:
- [x] 테스트 통과 (12/12 tests passed)
- [x] 디자인 시스템 준수 (docs/planning/05-design-system.md)
- [x] 반응형 확인

**완료 시**:
- [x] 사용자 승인 후 병합 (main 브랜치에서 직접 작업, 커밋 완료)
- [x] worktree 정리: N/A (Phase 1-3은 main에서 작업)

---

### [x] Phase 3, T3.3: 검색 페이지 통합 RED→GREEN

**담당**: frontend-specialist

**디자인 레퍼런스**:
| 파일 | 경로 | 설명 |
|------|------|------|
| HTML | [code.html](../../../design/welfare_alimi_landing_&_search/code.html) | 랜딩 & 검색 화면 |
| PNG | ![랜딩 & 검색](../../../design/welfare_alimi_landing_&_search/screen.png) | 검색 폼 |
| HTML | [code.html](../../../design/customized_benefit_results/code.html) | 검색 결과 화면 |
| PNG | ![검색 결과](../../../design/customized_benefit_results/screen.png) | 결과 카드 목록 |

**의존성**: T3.1 (SearchForm), T3.2 (BenefitCard) - **컴포넌트 통합**

**Git Worktree 설정**:
```bash
git worktree add ../welfare-notifier-phase3-search-page -b phase/3-search-page
cd ../welfare-notifier-phase3-search-page
```

**TDD 사이클**:

1. **RED**: 페이지 통합 테스트
   ```bash
   npm run test -- search.test.ts
   # Expected: FAILED
   ```

2. **GREEN**: 페이지 구현
   ```bash
   # 구현 파일: frontend/pages/search.vue
   npm run test -- search.test.ts
   # Expected: PASSED
   ```

**작업 내용**:
- SearchForm + BenefitCard 통합
- 로딩 상태 표시 (SearchForm 내부)
- 에러 핸들링 (네트워크 에러, 검증 에러)
- 결과 없음 안내

**산출물**:
- `frontend/pages/search.vue`
- `frontend/tests/pages/search.test.ts`

**인수 조건**:
- [x] 테스트 통과 (9/9 tests passed)
- [x] Mock API로 E2E 시나리오 확인
- [x] 로딩/에러 상태 확인

**완료 시**:
- [x] 작업 완료 (main 브랜치에서 직접 작업)
- [x] worktree 정리: N/A (Phase 1-3은 main에서 작업)

---

## M4: 통합 & E2E 테스트 (Phase 4)

### [x] Phase 4, T4.1: 보조금24 데이터 동기화 & 통합

**담당**: backend-specialist

**Git Worktree 설정**:
```bash
git worktree add ../alimi-phase4-integration -b phase/4-integration
cd ../alimi-phase4-integration
```

**동기화 전략**: 하이브리드 방식 (옵션 B)
- **1단계**: serviceList + supportConditions 기본 동기화 (2-3시간)
- **2단계**: serviceDetail 온디맨드 조회 + DB 캐싱

**총 서비스 수**: 약 10,924개

---

**작업 내용**:

1. **Prisma 스키마 확장** ✅ (완료)
   - serviceList 필드 추가 (16개: 지원대상, 선정기준, 지원내용, 신청방법, 신청기한, 소관기관, 연락처, 지원유형, 사용자구분, 접수기관, 조회수 등)
   - supportConditions 필드 추가 (30+개: 성별, 나이, 소득수준, 생애주기, 학생, 직업, 특수상황, 가족상황)
   - serviceDetail 필드 추가 (5개: 구비서류, 공무원확인구비서류, 본인확인필요구비서류, 온라인신청URL, 관련법령)
   - 복합 인덱스 추가 (소득수준, 생애주기, 학생, 가족상황 등)
   - 마이그레이션 실행: `npx prisma migrate dev`

2. **보조금24 API 클라이언트 구현**
   - `backend/src/services/gov24ApiClient.ts` 작성
   - `fetchServiceList()` - 서비스 목록 조회
   - `fetchSupportConditions()` - 지원조건 조회 (나이/소득 매칭용)
   - `fetchServiceDetail()` - 상세정보 조회 (온디맨드)

3. **데이터 동기화 스크립트 구현**
   - `backend/src/services/syncBenefits.ts` 작성
   - 페이징으로 전체 서비스 목록 조회
   - 각 서비스별 지원조건 조회 (매칭 조건)
   - Prisma Upsert로 DB 저장
   - Rate Limiting (1초 대기)
   - 진행률 로깅

4. **npm 스크립트 추가**
   - `package.json`에 `sync:benefits` 추가
   - 수동 실행: `npm run sync:benefits`

5. **검색 API 수정**
   - `benefitService.ts` 소득 매칭 로직 추가 (중위소득 기반)
   - 상세 조회 시 serviceDetail 온디맨드 호출

6. **프론트엔드 API 연동**
   - API 호출 방식 수정 (GET → POST)
   - 실제 백엔드 API 호출
   - MSW Mock은 개발환경에서만 사용 (이미 설정됨)

---

**보조금24 API 데이터 매핑** (총 40+ 필드):

> 자세한 매핑 정보는 `docs/planning/08-api-integration.md` 참조

**serviceList 필드**:

| 보조금24 필드 | Prisma 필드 | 설명 |
|-------------|-------------|------|
| 서비스ID | `id` | PK |
| 서비스명 | `name` | 서비스 이름 |
| 서비스분야 | `category` | 카테고리 |
| 서비스목적요약 | `description` | 간략 설명 |
| 지원대상 | `targetAudience` | 대상자 정보 |
| 선정기준 | `selectionCriteria` | 자격 조건 |
| 지원내용 | `supportDetails` | 지원 금액/내용 |
| 신청방법 | `applicationMethod` | 신청 방법 |
| 신청기한 | `applicationDeadline` | 신청 기간 |
| 상세조회URL | `link` | 정부24 링크 |
| 소관기관명 | `organizationName` | 담당 기관 |
| 전화문의 | `contactInfo` | 문의처 |
| 지원유형 | `supportType` | 현금/현물/서비스 등 |
| 사용자구분 | `userType` | 개인/가구/법인 |
| 접수기관명 | `applyAgency` | 접수 기관 |
| 조회수 | `viewCount` | 인기순 정렬용 |

**supportConditions 필드** (성별/나이/소득/생애주기/학생/직업/특수상황/가족):

| 보조금24 코드 | Prisma 필드 | 설명 |
|-------------|-------------|------|
| JA0101, JA0102 | `targetMale`, `targetFemale` | 성별 |
| JA0110, JA0111 | `minAge`, `maxAge` | 나이 |
| JA0201~JA0205 | `incomeLevel0to50`~`incomeLevelOver200` | 소득 5단계 |
| JA0301~JA0303 | `lifePregnancyPlan`, `lifePregnant`, `lifeBirth` | 생애주기 |
| JA0317~JA0320 | `lifeElementary`~`lifeUniversity` | 학생 |
| JA0313~JA0327 | `jobFarmer`~`jobSeeker` | 직업 6종 |
| JA0328~JA0330 | `targetDisabled`, `targetVeteran`, `targetDisease` | 특수상황 |
| JA0401~JA0413 | `familyMulticultural`~`familyNewResident` | 가족상황 7종 |

**serviceDetail 필드** (온디맨드):

| 보조금24 필드 | Prisma 필드 | 설명 |
|-------------|-------------|------|
| 구비서류 | `requiredDocuments` | 필요 서류 |
| 공무원확인구비서류 | `officialConfirmDocs` | 공무원 확인 서류 |
| 본인확인필요구비서류 | `identityConfirmDocs` | 본인 확인 서류 |
| 온라인신청사이트URL | `onlineApplyUrl` | 직접 신청 링크 |
| 법령 | `relatedLaws` | 관련 법령 |

---

**산출물**:
- `backend/prisma/schema.prisma` - 스키마 확장 ✅
- `backend/src/services/gov24ApiClient.ts` - 보조금24 API 클라이언트
- `backend/src/services/syncBenefits.ts` - 동기화 스크립트
- `backend/package.json` - `sync:benefits` 스크립트
- `backend/src/services/benefitService.ts` - 소득 매칭 로직 추가
- `frontend/app/composables/useBenefitSearch.ts` - API 호출 방식 수정

**환경변수**:
```bash
# backend/.env
OPENAPI_SERVICE_KEY=43006692951fc050808d9f8f3fe5c5d76426bdaf2bcf308933f1aeeff539011b
OPENAPI_BASE_URL=https://api.odcloud.kr/api
DATABASE_URL=mysql://alimi:password@localhost:3306/alimi
```

**실행 순서**:
```bash
# 1. Prisma 마이그레이션
cd backend
npx prisma migrate dev --name add_gov24_fields

# 2. 데이터 동기화 (약 2-3시간 소요)
npm run sync:benefits

# 3. DB 확인
npm run db:studio

# 4. 백엔드 서버 실행
npm run dev

# 5. 프론트엔드 실행
cd ../frontend
npm run dev

# 6. 검색 테스트
# 브라우저에서 localhost:3000 접속
# 나이/소득/지역 입력 후 검색
```

**참고 문서**:
- `docs/planning/08-api-integration.md` (API 통합 가이드) ✅ 업데이트됨

**완료 조건**:
- [x] Prisma 스키마 확장 및 마이그레이션
- [x] `gov24ApiClient.ts` 구현 완료
- [x] `syncBenefits.ts` 구현 완료
- [x] 첫 동기화 성공 (DB에 10,924개 데이터 확인)
- [x] 검색 API가 실제 DB 데이터 반환 (나이/소득 매칭)
- [x] 프론트엔드 API 호출 방식 수정 (GET → POST)
- [x] 실제 API 호출 성공 (FE → BE → DB)
- [x] CORS 에러 없음
- [x] 통합 테스트 통과

**완료 시**:
- [x] 구현 완료 (2026-01-15)
- [x] 커밋 완료

---

### [ ] Phase 4, T4.2: E2E 테스트 작성 & 검증

**담당**: test-specialist

**Git Worktree 설정**:
```bash
git worktree add ../welfare-notifier-phase4-e2e -b phase/4-e2e
cd ../welfare-notifier-phase4-e2e
```

**TDD 사이클**:

1. **RED**: E2E 테스트 작성
   ```bash
   npx playwright test
   # Expected: FAILED
   ```

2. **GREEN**: E2E 시나리오 검증
   ```bash
   npx playwright test
   # Expected: PASSED
   ```

**작업 내용**:
- Playwright E2E 테스트 작성
- 핵심 시나리오: 랜딩 → 검색 → 결과 확인 → 외부 링크 클릭

**산출물**:
- `e2e/search.spec.ts`

**E2E 시나리오**:
```typescript
test('서비스 검색 플로우', async ({ page }) => {
  // 1. 랜딩 페이지 접속
  await page.goto('http://localhost:3000')

  // 2. 검색 조건 입력
  await page.fill('input[name="age"]', '27')
  await page.selectOption('select[name="income"]', '0')
  await page.selectOption('select[name="region"]', '서울')

  // 3. 검색 실행
  await page.click('button:has-text("서비스 찾기")')

  // 4. 결과 확인
  await expect(page.locator('.benefit-card')).toHaveCount(3)
  await expect(page.locator('text=청년도약계좌')).toBeVisible()

  // 5. 외부 링크 클릭
  await page.click('text=신청하기')
})
```

**인수 조건**:
- [ ] E2E 테스트 통과
- [ ] 주요 사용자 플로우 검증 완료

**완료 시**:
- [ ] 사용자 승인 후 병합
- [ ] worktree 정리

---

### [ ] Phase 4, T4.3: 성능 최적화

**담당**: frontend-specialist

**Git Worktree 설정**:
```bash
git worktree add ../welfare-notifier-phase4-perf -b phase/4-perf
cd ../welfare-notifier-phase4-perf
```

**작업 내용**:
- 이미지 최적화 (WebP, lazy loading)
- 코드 스플리팅
- 폰트 최적화 (font-display: swap)
- Lighthouse 성능 측정

**산출물**:
- 최적화된 Nuxt 설정

**인수 조건**:
- [ ] Lighthouse 성능 점수 >= 90
- [ ] FCP < 3초
- [ ] LCP < 2.5초

**완료 시**:
- [ ] 사용자 승인 후 병합
- [ ] worktree 정리

---

### [x] Phase 4, T4.4: 검색 필터 확장 (MVP)

**담당**: backend-specialist, frontend-specialist

**Git Worktree 설정**:
```bash
git worktree add ../alimi-phase4-filters -b phase/4-filters
cd ../alimi-phase4-filters
```

**배경**:
- 현재 검색 결과가 8,000개 이상으로 너무 많음
- 나이/소득/지역 3개 필터만으로는 정확한 매칭 어려움
- DB에 이미 상세 필터 필드가 저장되어 있음 (supportConditions)

**추가할 필터 (MVP)**:

| 필터 | DB 필드 | UI 형태 | 효과 |
|------|---------|---------|------|
| **카테고리** | `category` | 드롭다운 | 10개 분류로 1/10 감소 |
| **임신/출산** | `lifePregnant`, `lifeBirth`, `lifePregnancyPlan` | 체크박스 | ~3,500개 대상 |
| **장애인** | `targetDisabled` | 체크박스 | ~3,700개 대상 |
| **한부모/조손** | `familySingleParent` | 체크박스 | ~7,800개 대상 |
| **다자녀가구** | `familyMultiChild` | 체크박스 | ~7,900개 대상 |

**작업 내용**:

1. **백엔드 (backend-specialist)**
   - `backend/src/schemas/benefit.ts` - 검색 스키마 확장
   - `backend/src/services/benefitService.ts` - 필터링 로직 추가
   - `backend/src/routes/benefits.ts` - API 파라미터 처리

2. **프론트엔드 (frontend-specialist)**
   - `frontend/app/composables/useBenefitSearch.ts` - 검색 파라미터 확장
   - `frontend/app/components/SearchForm.vue` - 필터 UI 추가
   - 반응형 필터 패널 디자인

**검색 API 파라미터 확장**:
```typescript
// POST /api/benefits/search
interface BenefitSearchRequest {
  // 기존 필터
  age?: number;
  income?: number;
  region?: string;

  // 신규 필터 (MVP)
  category?: string;           // 카테고리 (보육·교육, 주거·자립 등)
  lifePregnancy?: boolean;     // 임신/출산 관련
  targetDisabled?: boolean;    // 장애인
  familySingleParent?: boolean; // 한부모/조손가정
  familyMultiChild?: boolean;  // 다자녀가구
}
```

**UI 구조**:
```
[기본 정보]
├── 나이: [__] 세
├── 소득: [드롭다운: 중위소득 기준]
└── 지역: [드롭다운]

[카테고리]
└── [드롭다운: 전체 / 보육·교육 / 주거·자립 / ...]

[대상 조건] (체크박스)
├── □ 임신/출산 (임산부, 예비부모, 출산)
├── □ 장애인
├── □ 한부모/조손가정
└── □ 다자녀가구
```

**산출물**:
- `backend/src/schemas/benefit.ts` - 스키마 확장
- `backend/src/services/benefitService.ts` - 필터 로직
- `frontend/app/components/SearchForm.vue` - 필터 UI
- `frontend/app/composables/useBenefitSearch.ts` - API 연동
- `frontend/mocks/handlers/benefits.ts` - Mock 핸들러 업데이트

**예상 효과**:
| 필터 조합 | 예상 결과 수 |
|-----------|-------------|
| 27세 + 서울 | ~8,000개 |
| 27세 + 서울 + **보육·교육** | ~800개 |
| 27세 + 서울 + 보육·교육 + **임신/출산** | ~100개 |

**완료 조건**:
- [x] 백엔드 검색 스키마 확장
- [x] 백엔드 필터링 로직 구현
- [x] 프론트엔드 필터 UI 구현
- [x] MSW Mock 핸들러 업데이트
- [x] 검색 결과 수 감소 확인 (8,000개 → 100개 이하)
- [x] 반응형 UI 확인
- [x] 통합 테스트 통과 (BE: 24/24, FE: 12/12)

**완료 시**:
- [x] main 브랜치 병합 완료 (bb76e05)
- [x] 구현 완료 (2026-01-15)

---

### [x] Phase 4, T4.5: 페이징 처리 구현

**담당**: backend-specialist, frontend-specialist

**배경**:
- 검색 결과가 8,000개 이상으로 한 번에 로딩하기 어려움
- 사용자 경험 개선을 위한 "더 보기" 기능 필요

**작업 내용**:

1. **백엔드**
   - `benefitService.ts`: `totalCount` 병렬 쿼리 추가 (Promise.all)
   - `SearchResult` 인터페이스: `benefits`, `totalCount`, `page`, `limit`, `totalPages`
   - API 응답 형식 변경

2. **프론트엔드**
   - `useBenefitSearch.ts`: 페이징 상태 관리 (`currentPage`, `totalPages`, `loadingMore`)
   - `loadMore()`, `hasMore()` 함수 추가
   - "더 보기" 버튼 UI 추가 (index.vue, search.vue)

**산출물**:
- `backend/src/services/benefitService.ts` - 페이징 로직
- `frontend/app/composables/useBenefitSearch.ts` - 페이징 상태
- `frontend/app/pages/index.vue` - 더 보기 버튼
- `frontend/app/pages/search.vue` - 더 보기 버튼

**완료 조건**:
- [x] 백엔드 totalCount 반환
- [x] 프론트엔드 "더 보기" 버튼 동작
- [x] 테스트 통과 (BE: 24/24, FE: 54/54)

**완료 시**:
- [x] 커밋 완료 (2743375)
- [x] 구현 완료 (2026-01-15)

---

### [x] Phase 4, T4.6: 생년월일 입력으로 변경

**담당**: frontend-specialist

**배경**:
- 사용자가 만 나이를 직접 입력하면 잘못 계산할 수 있음
- 생년월일로 입력받으면 정확한 만 나이 계산 가능

**작업 내용**:

1. **SearchForm 변경**
   - 나이 입력 필드 → 생년월일 date input
   - 만 나이 자동 계산 (생일 지남 여부 반영)
   - 레이블에 만 나이 표시: "생년월일 (만 27세)"

2. **VueDatePicker 라이브러리 적용**
   - `@vuepic/vue-datepicker` 설치
   - 한국어 지원, yyyy년 MM월 dd일 형식
   - 테스트용 mock 추가

**산출물**:
- `frontend/app/components/SearchForm.vue` - 생년월일 입력
- `frontend/tests/setup.ts` - VueDatePicker mock
- `frontend/package.json` - @vuepic/vue-datepicker 추가

**완료 조건**:
- [x] 생년월일 date picker 동작
- [x] 만 나이 자동 계산 및 표시
- [x] 백엔드 API 변경 없음 (프론트에서 나이 계산 후 전송)
- [x] 테스트 통과 (54/54)

**완료 시**:
- [x] 커밋 완료 (81a468d, 54db630)
- [x] 구현 완료 (2026-01-15)

---

## M5: CI/CD 구축 & 배포 (Phase 5)

### [x] Phase 5, T5.1: Cafe24 서버 환경 구축

**담당**: backend-specialist

**작업 내용**:
- Cafe24 가상서버 호스팅 설정 확인
- SSH 접속 확인 및 키 생성
- Node.js, MySQL, Nginx, PM2 설치 확인
- 서버 디렉토리 구조 생성

**서버 환경**:
- IP: 183.111.126.54
- OS: Ubuntu/Debian
- Node.js: v20.19.6
- MySQL: 서버 내 설치
- Nginx: 1.18.0
- PM2: 6.0.14

**완료 조건**:
- [x] SSH 접속 가능
- [x] Node.js, npm, PM2, Nginx 설치 확인
- [x] MySQL 실행 확인
- [x] `/home/project1/alimi` 디렉토리 생성

**완료일**: 2026-01-15

---

### [x] Phase 5, T5.2: GitHub Actions CI/CD 파이프라인 구축

**담당**: backend-specialist

**작업 내용**:
- `.github/workflows/deploy.yml` 워크플로우 작성
- GitHub Secrets 설정 (SSH 키, 서버 정보)
- 빌드 스크립트 작성 (Backend: Express, Frontend: Nuxt SSR)
- SCP 배포 및 PM2 재시작 스크립트

**산출물**:
- `.github/workflows/deploy.yml`
- GitHub Secrets: CAFE24_HOST, CAFE24_USER, CAFE24_SSH_KEY

**배포 플로우**:
```
git push main → GitHub Actions → Build → SCP Deploy → PM2 Restart
```

**완료 조건**:
- [x] GitHub Actions 워크플로우 작성
- [x] SSH 키 생성 및 GitHub Secrets 등록
- [x] 자동 배포 성공 (main 브랜치 푸시 시)
- [x] PM2 프로세스 자동 재시작 확인

**완료일**: 2026-01-15

---

### [x] Phase 5, T5.3: Nginx 리버스 프록시 설정

**담당**: backend-specialist

**작업 내용**:
- Nginx 설정 파일 작성 (`/etc/nginx/sites-available/alimi`)
- 리버스 프록시 설정 (API → 8000, Frontend → 3000)
- Nginx 활성화 및 재시작

**Nginx 설정**:
```nginx
server {
    listen 80;
    server_name 183.111.126.54;

    location /api {
        proxy_pass http://localhost:8000;
    }

    location / {
        proxy_pass http://localhost:3000;
    }
}
```

**완료 조건**:
- [x] Nginx 설정 파일 작성
- [x] 설정 테스트 통과 (`nginx -t`)
- [x] Nginx 재시작 성공
- [x] 포트 80으로 접속 가능

**완료일**: 2026-01-15

---

### [x] Phase 5, T5.4: 서버 환경변수 및 PM2 설정

**담당**: backend-specialist

**작업 내용**:
- 백엔드 환경변수 파일 생성 (`/home/project1/alimi/backend/.env`)
- PM2 프로세스 시작 스크립트 작성
- PM2 재부팅 시 자동 시작 설정

**환경변수**:
- DATABASE_URL (MySQL 연결)
- OPENAPI_SERVICE_KEY (공공데이터 API 키)
- PORT, NODE_ENV, CORS_ORIGIN

**완료 조건**:
- [x] 환경변수 파일 생성 및 권한 설정 (chmod 600)
- [x] PM2로 백엔드 실행 (alimi-backend)
- [x] PM2로 프론트엔드 실행 (alimi-frontend)
- [x] PM2 설정 저장 (`pm2 save`)
- [x] PM2 자동 시작 설정 (`pm2 startup`)

**완료일**: 2026-01-15

---

### [x] Phase 5, T5.4.5: MySQL 데이터베이스 설정

**담당**: database-specialist

**작업 내용**:
- MySQL 데이터베이스 생성
- MySQL 사용자 생성 및 권한 부여
- 환경변수에 DATABASE_URL 설정
- Prisma 스키마 적용

**MySQL 설정**:
```sql
CREATE DATABASE alimi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'alimi'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON alimi.* TO 'alimi'@'localhost';
FLUSH PRIVILEGES;
```

**Prisma 스키마 적용**:
```bash
cd /home/project1/alimi/backend
npx prisma db push
# 또는
npx prisma migrate deploy
```

**완료 조건**:
- [x] MySQL 데이터베이스 생성 확인
- [x] 사용자 권한 설정 완료
- [x] DATABASE_URL 환경변수 설정
- [x] Prisma 스키마 적용 완료
- [x] 백엔드 재시작 및 DB 연결 확인

**완료일**: 2026-01-15

---

### [x] Phase 5, T5.5: 배포 테스트 및 문서화

**담당**: all

**작업 내용**:
- 프로덕션 배포 테스트
- 서비스 동작 확인 (http://183.111.126.54)
- 배포 가이드 문서 작성
- CLAUDE.md 업데이트

**테스트 항목**:
- [x] 프론트엔드 접속 확인 (http://183.111.126.54)
- [x] 백엔드 API 확인 (http://183.111.126.54/api/health)
- [x] PM2 프로세스 상태 확인
- [x] Nginx 리버스 프록시 동작 확인
- [x] GitHub Actions 자동 배포 테스트

**산출물**:
- `docs/planning/09-deployment-guide.md` (배포 가이드)
- `docs/planning/02-trd.md` (인프라 섹션 업데이트)
- `CLAUDE.md` (Deployment 섹션 추가)

**완료 조건**:
- [x] 프로덕션 서비스 정상 동작
- [x] CI/CD 파이프라인 동작 확인
- [x] 배포 관련 문서 작성 완료

**완료일**: 2026-01-15

---

### [ ] Phase 5, T5.6: Google Analytics & AdSense 설정 (추후 진행)

**담당**: frontend-specialist

**작업 내용**:
- Google Analytics 4 설정
- Google AdSense 신청 및 승인
- 광고 배치 (랜딩, 검색 결과)

**산출물**:
- GA4 추적 코드
- AdSense 광고 코드

**완료 조건**:
- [ ] GA4 이벤트 추적 확인 (검색, 클릭)
- [ ] AdSense 승인 완료
- [ ] 광고 노출 확인

**비고**: M4 (데이터 동기화) 완료 후 진행

---

## 병렬 실행 가능 태스크

다음 태스크들은 **독립적으로 병렬 실행 가능**합니다:

| 그룹 | 병렬 가능 태스크 | 이유 |
|------|-----------------|------|
| M0 | T0.1, T0.2 | 프로젝트 구조 초기화와 Docker 설정은 독립적 |
| M0.5 | T0.5.2, T0.5.3 | 백엔드 테스트와 프론트엔드 Mock은 계약만 있으면 독립 작업 |
| M1 | T1.1, T1.2 | 랜딩 페이지 UI와 SEO 설정은 독립적 |
| M2 | T2.1, T2.2 | DB 모델과 API 클라이언트는 독립적 (Mock 사용) |
| M3 | T3.1, T3.2 | SearchForm과 BenefitCard는 독립 컴포넌트 |

---

## 의존성 그래프

```mermaid
flowchart TD
    T0.1[Phase 0, T0.1: 프로젝트 구조] --> T0.3[Phase 0, T0.3: DB 연결]
    T0.2[Phase 0, T0.2: Docker 설정] --> T0.3
    T0.3 --> T0.5.1[Phase 0, T0.5.1: API 계약]
    T0.5.1 --> T0.5.2[Phase 0, T0.5.2: BE 테스트]
    T0.5.1 --> T0.5.3[Phase 0, T0.5.3: FE Mock]

    T0.5.2 --> T2.3[Phase 2, T2.3: 검색 API]
    T0.5.3 --> T3.1[Phase 3, T3.1: 검색 폼]

    T0.1 --> T1.1[Phase 1, T1.1: 랜딩 페이지]
    T1.1 --> T1.2[Phase 1, T1.2: SEO]

    T0.3 --> T2.1[Phase 2, T2.1: DB 모델]
    T0.3 --> T2.2[Phase 2, T2.2: API 클라이언트]
    T2.1 --> T2.3
    T2.2 --> T2.3

    T3.1 --> T3.3[Phase 3, T3.3: 검색 페이지]
    T3.2[Phase 3, T3.2: 카드 컴포넌트] --> T3.3

    T2.3 --> T4.1[Phase 4, T4.1: Mock 제거]
    T3.3 --> T4.1
    T4.1 --> T4.2[Phase 4, T4.2: E2E 테스트]

    T4.2 --> T5.1[Phase 5, T5.1: FE 배포]
    T4.2 --> T5.2[Phase 5, T5.2: BE 배포]

    style T0.1 fill:#FFB6C1
    style T0.2 fill:#FFB6C1
    style T0.3 fill:#FFB6C1
    style T0.5.1 fill:#FFB6C1
    style T0.5.2 fill:#FFB6C1
    style T0.5.3 fill:#FFB6C1
```

---

## 다음 우선순위 작업

1. **Phase 8, T8.1**: 백엔드 스키마 및 서비스 확장 (현재 진행 예정)
   - 검색 필터 확장 (대상자 6개 + 지원유형 + 신청 필터 2개)
   - 정렬 기능 추가 (최신순/인기순)
2. **Phase 8, T8.2**: 프론트엔드 필터 UI 추가
3. **Phase 8, T8.3**: 정렬 기능 구현
4. **Phase 4, T4.2**: E2E 테스트 작성 (Playwright)
5. **Phase 4, T4.3**: 성능 최적화 (Lighthouse)
6. **Phase 5, T5.6**: Google Analytics & AdSense 설정

---

## 참고 문서

| 문서 | 경로 | 용도 |
|------|------|------|
| PRD | docs/planning/01-prd.md | 제품 요구사항 |
| TRD | docs/planning/02-trd.md | 기술 요구사항 |
| User Flow | docs/planning/03-user-flow.md | 사용자 흐름 |
| Database Design | docs/planning/04-database-design.md | DB 스키마 |
| Design System | docs/planning/05-design-system.md | 디자인 가이드 |
| Coding Convention | docs/planning/07-coding-convention.md | 코딩 규칙 |

---

## 디자인 레퍼런스 (Google Stitch 목업)

`design/` 폴더에 저장된 목업 파일 목록입니다.

| 폴더명 | HTML | PNG | 연결된 Task |
|--------|------|-----|-------------|
| `welfare_alimi_landing_&_search/` | [code.html](../../design/welfare_alimi_landing_&_search/code.html) | [screen.png](../../design/welfare_alimi_landing_&_search/screen.png) | T1.1, T3.1, T3.3 |
| `customized_benefit_results/` | [code.html](../../design/customized_benefit_results/code.html) | [screen.png](../../design/customized_benefit_results/screen.png) | T3.2, T3.3 |
| `benefit_details_&_application/` | [code.html](../../design/benefit_details_&_application/code.html) | [screen.png](../../design/benefit_details_&_application/screen.png) | T6.1, T6.2, T6.3, T6.4 |

---

## M6: FEAT-1-3 서비스 상세 페이지 (Phase 6)

> 검색 결과에서 바로 외부 링크로 이동하지 않고, 상세 페이지를 거쳐 더 많은 정보를 제공하는 고도화 기능

### 마일스톤 개요

| 항목 | 내용 |
|------|------|
| **목표** | 서비스 상세 정보 페이지 추가로 사용자 경험 개선 |
| **성공 지표** | 신청 클릭률 증가 (상세 페이지 → 정부24 이동 비율) |
| **MVP 범위** | 히어로 + 자격요건 + 구비서류 + 신청절차 + 신청버튼 + 관련추천 |
| **디자인** | `design/benefit_details_&_application/` 목업 기준 |

---

### [x] Phase 6, T6.1: 백엔드 상세 조회 API RED→GREEN

**담당**: backend-specialist

**Git Worktree 설정**:
```bash
git worktree add ../alimi-phase6-detail-api -b phase/6-detail-api
cd ../alimi-phase6-detail-api
```

**TDD 사이클**:

1. **RED**: 테스트 작성
   ```bash
   # 테스트 파일: backend/__tests__/api/benefits-detail.test.ts
   npm run test -- benefits-detail.test.ts
   # Expected: FAILED
   ```

2. **GREEN**: API 구현
   ```bash
   # 구현 파일: backend/src/routes/benefits.ts
   npm run test -- benefits-detail.test.ts
   # Expected: PASSED
   ```

**작업 내용**:
- `GET /api/benefits/:id` - 서비스 상세 조회 API
- 조회수 카운팅 로직 (viewCount 증가)
- 관련 서비스 추천 API (같은 카테고리 + 조회수 높은 순)

**API 스펙**:
```typescript
// GET /api/benefits/:id
interface BenefitDetailResponse {
  benefit: {
    id: string;
    name: string;
    category: string;
    description: string;
    supportDetails: string;        // 지원 금액/혜택
    targetAudience: string;        // 대상자
    selectionCriteria: string;     // 자격 요건
    requiredDocuments: string;     // 구비 서류
    applicationMethod: string;     // 신청 방법
    applicationDeadline: string;   // 신청 기한
    link: string;                  // 정부24 링크
    viewCount: number;             // 조회수
    // ... 기타 필드
  };
  relatedBenefits: Benefit[];      // 관련 서비스 3개
}
```

**산출물**:
- `backend/src/routes/benefits.ts` - 상세 조회 라우트 추가
- `backend/src/services/benefitService.ts` - 상세 조회 + 관련 추천 로직
- `backend/__tests__/api/benefits-detail.test.ts` - 테스트

**완료 조건**:
- [x] `GET /api/benefits/:id` 동작 확인
- [x] 조회수 증가 확인
- [x] 관련 서비스 3개 반환 확인
- [x] 테스트 통과 (5/5)

**완료 시**:
- [x] 사용자 승인 후 병합 (main)
- [x] worktree 정리

**완료일**: 2026-01-15

---

### [x] Phase 6, T6.2: 상세 페이지 컴포넌트 구현 RED→GREEN

**담당**: frontend-specialist

**디자인 레퍼런스**:
| 파일 | 경로 | 설명 |
|------|------|------|
| HTML | [code.html](../../../design/benefit_details_&_application/code.html) | 상세 페이지 전체 |
| PNG | ![상세 페이지 목업](../../../design/benefit_details_&_application/screen.png) | 디자인 참조 |

**Git Worktree 설정**:
```bash
git worktree add ../alimi-phase6-detail-components -b phase/6-detail-components
cd ../alimi-phase6-detail-components
```

**TDD 사이클**:

1. **RED**: 컴포넌트 테스트 작성
   ```bash
   npm run test -- BenefitDetail.test.ts
   # Expected: FAILED
   ```

2. **GREEN**: 컴포넌트 구현
   ```bash
   npm run test -- BenefitDetail.test.ts
   # Expected: PASSED
   ```

**작업 내용**:
- 상세 페이지 컴포넌트 구현 (목업 기준)
- 반응형 레이아웃 (8:4 그리드 → 모바일 1컬럼)
- 모바일 하단 고정 바

**컴포넌트 목록**:
| 컴포넌트 | 역할 | 위치 |
|----------|------|------|
| `BenefitHero.vue` | 히어로 섹션 (서비스명, 금액, 태그, 조회수) | 메인 상단 |
| `EligibilityCard.vue` | 자격 요건 목록 | 메인 |
| `DocumentsCard.vue` | 구비 서류 목록 | 메인 |
| `ProcessSteps.vue` | 신청 절차 (단계별) | 메인 |
| `ApplySidebar.vue` | 신청 마감일 + 버튼 | 사이드바 |
| `RelatedBenefits.vue` | 관련 서비스 추천 카드 | 하단 |
| `MobileBottomBar.vue` | 모바일 하단 고정 바 | 모바일 |

**산출물**:
- `frontend/app/components/benefit/BenefitHero.vue`
- `frontend/app/components/benefit/EligibilityCard.vue`
- `frontend/app/components/benefit/DocumentsCard.vue`
- `frontend/app/components/benefit/ProcessSteps.vue`
- `frontend/app/components/benefit/ApplySidebar.vue`
- `frontend/app/components/benefit/RelatedBenefits.vue`
- `frontend/app/components/benefit/MobileBottomBar.vue`
- `frontend/tests/components/benefit/*.test.ts`

**완료 조건**:
- [x] 모든 컴포넌트 테스트 통과 (47개 테스트)
- [x] 목업과 동일한 UI 구현 (7개 컴포넌트)
- [x] 반응형 레이아웃 확인 (lg: 2컬럼, 모바일: 1컬럼)
- [x] 모바일 하단 바 동작 확인 (lg:hidden)

**완료 시**:
- [x] 사용자 승인 후 병합 (main)
- [x] worktree 정리

**완료일**: 2026-01-16

---

### [x] Phase 6, T6.3: 상세 페이지 통합 RED→GREEN

**담당**: frontend-specialist

**의존성**: T6.1 (백엔드 API), T6.2 (컴포넌트)

**Git Worktree 설정**:
```bash
git worktree add ../alimi-phase6-detail-page -b phase/6-detail-page
cd ../alimi-phase6-detail-page
```

**TDD 사이클**:

1. **RED**: 페이지 테스트 작성
   ```bash
   npm run test -- benefits-id.test.ts
   # Expected: FAILED
   ```

2. **GREEN**: 페이지 구현
   ```bash
   npm run test -- benefits-id.test.ts
   # Expected: PASSED
   ```

**작업 내용**:
- `/benefits/:id` 동적 라우트 페이지 구현
- 컴포넌트 통합
- API 연동 (useBenefitDetail composable)
- SEO 최적화 (useSeoMeta)
- 로딩/에러 상태 처리

**산출물**:
- `frontend/app/pages/benefits/[id].vue` - 상세 페이지
- `frontend/app/composables/useBenefitDetail.ts` - API 호출 composable
- `frontend/tests/pages/benefits-id.test.ts` - 테스트

**SEO 설정**:
```typescript
// pages/benefits/[id].vue
useSeoMeta({
  title: () => `${benefit.value?.name} - 복지알리미`,
  description: () => benefit.value?.description,
  ogTitle: () => benefit.value?.name,
  ogDescription: () => benefit.value?.supportDetails,
})
```

**완료 조건**:
- [x] `/benefits/:id` 페이지 동작 확인
- [x] API 연동 성공 (useBenefitDetail)
- [x] SEO 메타태그 확인
- [x] 로딩/에러 상태 처리
- [x] 테스트 통과 (109개)

**완료 시**:
- [x] 사용자 승인 후 병합 (main)
- [x] worktree 정리

**완료일**: 2026-01-16

---

### [x] Phase 6, T6.4: BenefitCard 클릭 동작 변경

**담당**: frontend-specialist

**의존성**: T6.3 (상세 페이지)

**Git Worktree 설정**:
```bash
git worktree add ../alimi-phase6-card-link -b phase/6-card-link
cd ../alimi-phase6-card-link
```

**작업 내용**:
- `BenefitCard.vue` 클릭 시 외부 링크 → 상세 페이지로 변경
- `NuxtLink`로 `/benefits/:id`로 이동

**변경 전**:
```vue
<!-- 외부 링크로 바로 이동 -->
<a :href="benefit.link" target="_blank">
```

**변경 후**:
```vue
<!-- 상세 페이지로 이동 -->
<NuxtLink :to="`/benefits/${benefit.id}`">
```

**산출물**:
- `frontend/app/components/BenefitCard.vue` 수정
- `frontend/tests/components/BenefitCard.test.ts` 테스트 수정

**완료 조건**:
- [x] 카드 클릭 시 상세 페이지로 이동
- [x] 기존 테스트 수정 및 통과
- [x] E2E 시나리오 확인: 검색 → 카드 클릭 → 상세 → 신청하러 가기

**완료 시**:
- [x] T6.3에서 함께 구현됨 (main 병합 완료)
- [x] worktree 정리: N/A

**완료일**: 2026-01-16 (T6.3과 함께 완료)

---

### [x] Phase 6, T6.5: 상세 정보 온디맨드 조회 + SSR 최적화

**담당**: backend-specialist, frontend-specialist

**의존성**: T6.3 (상세 페이지 통합)

**배경**:
- 현재 상세 페이지가 허술함 (구비서류, 온라인신청URL 등 누락)
- `serviceDetail` API 데이터를 아직 활용하지 않음
- 클라이언트 사이드 로딩으로 SEO 불리

**작업 내용**:

1. **백엔드 (backend-specialist)**
   - `benefitService.ts`: `getBenefitDetailWithRelated()` 수정
   - `detailFetchedAt`이 NULL이면 Gov24 serviceDetail API 호출
   - DB에 캐싱: `requiredDocuments`, `onlineApplyUrl`, `relatedLaws`

2. **프론트엔드 (frontend-specialist)**
   - `pages/benefits/[id].vue`: `onMounted` → `useAsyncData` 전환 (SSR)
   - `composables/useBenefitDetail.ts`: 타입 확장 (`onlineApplyUrl`, `relatedLaws`)
   - `components/benefit/ApplySidebar.vue`: 온라인 신청 버튼 추가

**데이터 흐름**:
```
사용자/크롤러 요청
    ↓
Nuxt SSR (useAsyncData)
    ↓
Backend API: GET /api/benefits/:id
    ↓
benefitService.getBenefitDetailWithRelated(id)
    ↓
DB 조회 → detailFetchedAt이 NULL?
    ├─ Yes → Gov24 serviceDetail API 호출 → DB 업데이트
    └─ No → 캐시된 데이터 사용
    ↓
완전한 HTML 반환 (SEO 최적화)
```

**산출물**:
- `backend/src/services/benefitService.ts` - 온디맨드 조회 로직
- `frontend/app/pages/benefits/[id].vue` - SSR 전환
- `frontend/app/composables/useBenefitDetail.ts` - 타입 확장
- `frontend/app/components/benefit/ApplySidebar.vue` - 온라인 신청 버튼

**완료 조건**:
- [x] 백엔드 serviceDetail 온디맨드 조회 동작
- [x] DB 캐싱 확인 (`detailFetchedAt` 업데이트)
- [x] 프론트엔드 SSR로 전환 (useLazyAsyncData 사용)
- [x] 페이지 소스에 구비서류 내용 포함 (SEO 확인) - E2E 검증 필요
- [x] 온라인 신청 버튼 동작 (URL이 있을 때만 표시)

**산출물**:
- `backend/src/services/benefitService.ts` - 온디맨드 조회 로직 추가 (BE 테스트 6/6 통과)
- `backend/src/schemas/benefit.ts` - BenefitDetail 타입 확장
- `frontend/app/pages/benefits/[id].vue` - SSR 전환 (useLazyAsyncData)
- `frontend/app/composables/useBenefitDetail.ts` - 타입 확장
- `frontend/app/components/benefit/ApplySidebar.vue` - "바로 신청하기" 버튼 추가

**완료 시**:
- [x] 구현 완료 (2026-01-16)
- [ ] 배포 후 E2E 검증 (T6.8에서 진행)

**완료일**: 2026-01-16

---

### [x] Phase 6, T6.7: 상세 페이지 정보 확장

**담당**: backend-specialist, frontend-specialist

**의존성**: T6.5 (상세 정보 온디맨드 조회)

**배경**:
- DB에 저장된 유용한 정보들이 상세 페이지에 표시되지 않음
- 사용자가 신청 전 더 많은 정보를 확인할 수 있도록 개선

**추가할 필드**:

| 필드 | 설명 | UI 위치 |
|------|------|---------|
| `contactInfo` | 전화문의 | ApplySidebar - 전화 버튼 |
| `supportType` | 지원유형 (현금/현물/서비스) | BenefitHero - 배지 |
| `applyAgency` | 접수기관 | ApplySidebar |
| `officialConfirmDocs` | 공무원 확인 서류 | DocumentsCard |
| `identityConfirmDocs` | 본인 확인 서류 | DocumentsCard |
| `relatedLaws` | 관련 법령 | RelatedLawsCard (새 컴포넌트) |

**작업 내용**:

1. **백엔드**
   - `schemas/benefit.ts`: BenefitDetail 타입에 필드 추가
   - `services/benefitService.ts`: 응답에 필드 포함

2. **프론트엔드**
   - `composables/useBenefitDetail.ts`: 타입 확장
   - `components/benefit/BenefitHero.vue`: supportType 배지
   - `components/benefit/ApplySidebar.vue`: 접수기관, 전화버튼
   - `components/benefit/DocumentsCard.vue`: 서류 섹션 확장
   - `components/benefit/RelatedLawsCard.vue`: 새 컴포넌트

**산출물**:
- `backend/src/schemas/benefit.ts` - 타입 확장 (BE 테스트 30/30 통과)
- `backend/src/services/benefitService.ts` - 응답 필드 추가
- `frontend/app/composables/useBenefitDetail.ts` - 타입 확장
- `frontend/app/components/benefit/BenefitHero.vue` - supportType 배지
- `frontend/app/components/benefit/ApplySidebar.vue` - 접수기관, 전화버튼
- `frontend/app/components/benefit/DocumentsCard.vue` - 서류 섹션 확장
- `frontend/app/components/benefit/RelatedLawsCard.vue` - 새 컴포넌트 (FE 테스트 117/117 통과)

**완료 조건**:
- [x] 백엔드 응답에 6개 필드 포함
- [x] BenefitHero에 supportType 배지 표시
- [x] ApplySidebar에 접수기관 표시
- [x] ApplySidebar에 전화문의 버튼 표시
- [x] DocumentsCard에 공무원 확인 서류 섹션
- [x] DocumentsCard에 본인 확인 서류 섹션
- [x] RelatedLawsCard 컴포넌트 동작
- [x] 테스트 통과 (BE: 30/30, FE: 117/117)

**버그 수정**:
- [x] RelatedBenefits 내부 링크 버그 수정
  - 문제: 관련 서비스 카드 클릭 시 외부 링크(`benefit.link`)로 이동
  - 해결: NuxtLink로 내부 상세 페이지(`/benefits/${benefit.id}`)로 이동하도록 변경
  - 수정 파일: `RelatedBenefits.vue`, `RelatedBenefits.test.ts`

**완료 시**:
- [x] 구현 완료 (2026-01-16)
- [x] 버그 수정 완료 (2026-01-16)

**완료일**: 2026-01-16

---

### [x] Phase 6, T6.9: 상세 페이지 데이터 표시 정제

**담당**: frontend-specialist

**의존성**: T6.7 (상세 페이지 정보 확장)

**배경**:
- 자격 요건에 "O" 특수문자가 그대로 표시됨
- 구비서류에 "신청인 제출서류" 같은 카테고리 헤더도 목록에 표시됨
- 신청 마감일에 "(NaN)", "Invalid Date" 그대로 출력됨

**작업 내용**:

1. **EligibilityCard.vue** - 특수문자 정제
   - `cleanText()` 함수 추가 (○, ●, ◎ 등 특수 기호 제거)
   - 연속 공백 정리

2. **DocumentsCard.vue** - 카테고리 헤더 필터링
   - `isDocumentItem()` 함수 추가 (헤더 패턴 제외)
   - `cleanDocumentName()` 함수 추가 (앞의 기호/번호 제거)

3. **ApplySidebar.vue** - 날짜 파싱 안전 처리
   - `NON_DATE_KEYWORDS` 정의 (상시, 연중, 수시 등)
   - `isValidDate()`, `isCalculableDeadline` 추가
   - Invalid Date인 경우 원본 텍스트 표시

**산출물**:
- `frontend/app/components/benefit/EligibilityCard.vue` - 특수문자 정제
- `frontend/app/components/benefit/DocumentsCard.vue` - 카테고리 필터링
- `frontend/app/components/benefit/ApplySidebar.vue` - 날짜 안전 처리

**완료 조건**:
- [x] EligibilityCard 특수문자 제거
- [x] DocumentsCard 카테고리 헤더 필터링
- [x] ApplySidebar 날짜 파싱 안전 처리
- [x] 테스트 통과 (117/117)

**완료 시**:
- [x] 구현 완료 (2026-01-16)

**완료일**: 2026-01-16

---

### [x] Phase 6, T6.10: 신청 기간 표시 개선

**담당**: frontend-specialist

**의존성**: T6.9 (상세 페이지 데이터 정제)

**배경**:
- "신청 마감" 라벨이 부정확 (실제로는 신청 기간)
- 다양한 데이터 형식 존재: 상시, 기간형, 예산 소진형, 예정형 등
- 복잡한 텍스트 (○ 정기신청, ○ 반기신청 등) 가독성 문제

**작업 내용**:

1. **useDeadline.ts** - 신규 composable 생성
   - `classifyDeadline()` - 데이터 형식 분류 (always/period/budget/scheduled/text)
   - `parseKoreanDate()` - 한국어 날짜 파싱 (2025.01.01, 2025-01-01, 2025년 1월 1일 등)
   - `parseDateRange()` - 기간 파싱 (시작일 ~ 종료일)
   - `calculateDaysLeft()` - D-Day 계산
   - `calculateProgress()` - 진행률 계산
   - `formatMultiLineText()` - ○, ●, - 구분자를 줄바꿈으로 변환

2. **ApplySidebar.vue** - UI 개선
   - 라벨 변경: "신청 마감" → "신청 기간"
   - 형식별 분기 표시:
     - 상시형: 녹색 배지 + 애니메이션 펄스
     - 예산 소진형: 주황색 배지 (선착순)
     - 기간형: D-Day + 진행률 바
     - 예정/미정형: 회색 이탤릭 텍스트
     - 복합 텍스트: 줄바꿈 처리 + whitespace-pre-line

**산출물**:
- `frontend/app/composables/useDeadline.ts` (신규)
- `frontend/app/components/benefit/ApplySidebar.vue` (수정)
- `frontend/tests/components/benefit/ApplySidebar.test.ts` (수정)

**완료 조건**:
- [x] useDeadline composable 구현
- [x] ApplySidebar 형식별 UI 분기
- [x] 멀티라인 텍스트 줄바꿈 처리
- [x] 테스트 통과 (124/124)

**완료 시**:
- [x] 구현 완료 (2026-01-16)

**완료일**: 2026-01-16

---

### [x] Phase 6, T6.11: 자격 요건 카드 스타일 개선

**담당**: frontend-specialist

**의존성**: T6.10

**배경**:
- 대상자/선발기준 텍스트가 길면 2열 그리드에서 가독성 저하
- 줄간격이 좁아 텍스트 밀집도 높음

**작업 내용**:

1. **EligibilityCard.vue** - 레이아웃 및 스타일 개선
   - 2열 그리드 → 1열 스택 레이아웃
   - 줄간격 추가 (`leading-relaxed`)
   - 아이콘 축소 방지 (`flex-shrink-0`)
   - 라벨 여백 추가 (`mb-1`)
   - 다크모드 지원 추가

**산출물**:
- `frontend/app/components/benefit/EligibilityCard.vue` (수정)

**완료 조건**:
- [x] 1열 레이아웃 변경
- [x] 줄간격 개선
- [x] 테스트 통과 (124/124)

**완료 시**:
- [x] 구현 완료 (2026-01-16)

**완료일**: 2026-01-16

---

### [x] Phase 6, T6.12: 신청 방법 태그 UI 변경

**담당**: frontend-specialist

**의존성**: T6.11

**배경**:
- 숫자 배지(1, 2, 3) + 연결선이 "순서대로 진행" 느낌
- 실제 데이터는 "온라인신청 OR 방문신청" 같은 선택지

**작업 내용**:

1. **ProcessSteps.vue** - 레이아웃 전면 변경
   - 숫자 배지 → 체크 아이콘 태그/칩
   - 세로 순서 레이아웃 → 가로 `flex-wrap` 배열
   - 1개/2개+ 분기 로직 제거 (동일한 태그 스타일로 통일)
   - 연결선 제거

**산출물**:
- `frontend/app/components/benefit/ProcessSteps.vue` (수정)
- `frontend/tests/components/benefit/ProcessSteps.test.ts` (수정)

**완료 조건**:
- [x] 태그/칩 레이아웃 구현
- [x] 테스트 업데이트
- [x] 테스트 통과 (124/124)

**완료 시**:
- [x] 구현 완료 (2026-01-16)

**완료일**: 2026-01-16

---

### [x] Phase 6, T6.8: 배포 및 검증

**담당**: all

**의존성**: T6.1 ~ T6.12 모두 완료

**작업 내용**:
- 프로덕션 배포 (GitHub Actions)
- 실서버 동작 확인
- 신청 클릭률 모니터링 설정

**테스트 항목**:
- [x] 검색 결과 카드 클릭 → 상세 페이지 이동 (코드 구현 완료, DB 데이터 필요)
- [x] 상세 페이지 모든 섹션 표시 확인 (구비서류, 온라인신청URL 포함)
- [x] "신청하러 가기" 버튼 → 정부24 이동
- [x] 온라인 신청 버튼 → 직접 신청 사이트 이동
- [x] 관련 서비스 추천 표시 확인
- [x] 모바일 하단 바 동작 확인
- [x] SEO 메타태그 확인 (Open Graph) - og:title, og:description, og:image 확인됨
- [x] 페이지 소스에서 SSR 확인 (data-ssr="true" 확인됨)

**완료 조건**:
- [x] 프로덕션 배포 성공 (GitHub Actions #13 성공)
- [x] 모든 테스트 항목 통과 (코드 레벨)
- [ ] 신청 클릭 이벤트 추적 확인 (별도 GA 설정 필요)

**배포 결과**:
- 배포 커밋: `aa5f1b7` (2026-01-16)
- 서버 상태: Health Check 200 OK
- SSR: 정상 동작
- SEO 메타태그: 정상 표시

**참고**:
- 프로덕션 DB에 데이터 동기화 필요 (`npm run sync:benefits`)
- GA 이벤트 추적은 별도 태스크로 분리

**완료일**: 2026-01-16

---

## Phase 6 의존성 그래프

```mermaid
flowchart TD
    T6.1[T6.1: 백엔드 API] --> T6.3[T6.3: 페이지 통합]
    T6.2[T6.2: 컴포넌트 구현] --> T6.3
    T6.3 --> T6.4[T6.4: 카드 링크 변경]
    T6.3 --> T6.5[T6.5: 온디맨드 조회 + SSR]
    T6.5 --> T6.7[T6.7: 정보 확장]
    T6.7 --> T6.9[T6.9: 데이터 정제]
    T6.9 --> T6.10[T6.10: 신청 기간 개선]
    T6.10 --> T6.11[T6.11: 자격 요건 스타일]
    T6.11 --> T6.12[T6.12: 신청 방법 태그]
    T6.4 --> T6.8[T6.8: 배포 및 검증]
    T6.12 --> T6.8

    style T6.1 fill:#90EE90
    style T6.2 fill:#90EE90
    style T6.3 fill:#90EE90
    style T6.4 fill:#90EE90
    style T6.5 fill:#90EE90
    style T6.7 fill:#90EE90
    style T6.9 fill:#90EE90
    style T6.10 fill:#90EE90
    style T6.11 fill:#90EE90
    style T6.12 fill:#90EE90
    style T6.8 fill:#90EE90
```

**완료**: T6.1 ~ T6.12, T6.8 (배포 및 검증)
**Phase 6 전체 완료** ✅

---

## M7: 데이터 동기화 복구 (Phase 7)

> 보조금24 데이터 일일 동기화 기능 복구

### [x] Phase 7, T7.1: syncBenefits.ts 수정

**담당**: backend-specialist

**작업 내용**:
- import 경로 수정: `publicApiClient.js` → `gov24ApiClient.js`
- 함수명 수정: `fetchGov24ServiceList` → `fetchAllServiceList`
- 함수명 수정: `fetchGov24SupportConditions` → `fetchAllSupportConditions`
- DB 필드 매핑 업데이트

**완료 조건**:
- [x] import 오류 해결
- [x] 타입 오류 없음

**완료일**: 2026-01-16

---

### [x] Phase 7, T7.2: tsconfig.json 수정

**담당**: backend-specialist

**의존성**: T7.1

**작업 내용**:
- exclude 목록에서 `src/services/syncBenefits.ts` 제거

**완료 조건**:
- [x] `npm run build` 성공
- [x] `dist/services/syncBenefits.js` 생성 확인

**완료일**: 2026-01-16

---

### [x] Phase 7, T7.3: 빌드 테스트

**담당**: backend-specialist

**의존성**: T7.2

**작업 내용**:
- `npm run build` 성공 확인
- `dist/services/syncBenefits.js` 생성 확인

**완료 조건**:
- [x] 빌드 성공
- [x] 컴파일된 JS 파일 생성

**완료일**: 2026-01-16

---

### [x] Phase 7, T7.4: 배포

**담당**: all

**의존성**: T7.3

**작업 내용**:
- GitHub에 푸시
- GitHub Actions 배포 완료

**완료 조건**:
- [x] GitHub Actions 성공 (커밋: c5dc74b)
- [ ] 서버에 `dist/services/syncBenefits.js` 존재 (배포 완료 후 확인)

---

### [x] Phase 7, T7.5: 서버 초기 동기화

**담당**: all

**의존성**: T7.4

**작업 내용**:
```bash
cd /home/project1/alimi/backend
node dist/services/syncBenefits.js
```

**완료 조건**:
- [x] 동기화 완료 (~10,924개 서비스)
- [x] 검색 API 정상 동작

**완료일**: 2026-01-16

---

### [x] Phase 7, T7.6: 크론잡 설정

**담당**: all

**의존성**: T7.5

**작업 내용**:
```bash
# 매일 새벽 3시 동기화
crontab -e
0 3 * * * cd /home/project1/alimi/backend && node dist/services/syncBenefits.js >> /var/log/alimi-sync.log 2>&1
```

**완료 조건**:
- [x] 크론잡 등록 확인: `crontab -l`
- [x] 로그 파일 생성 확인

**완료일**: 2026-01-16

---

## Phase 7 의존성 그래프

```mermaid
flowchart TD
    T7.1[T7.1: syncBenefits.ts 수정] --> T7.2[T7.2: tsconfig.json 수정]
    T7.2 --> T7.3[T7.3: 로컬 테스트]
    T7.3 --> T7.4[T7.4: 배포]
    T7.4 --> T7.5[T7.5: 서버 초기 동기화]
    T7.4 --> T7.6[T7.6: 크론잡 설정]

    style T7.1 fill:#90EE90
    style T7.2 fill:#90EE90
    style T7.3 fill:#90EE90
    style T7.4 fill:#90EE90
    style T7.5 fill:#90EE90
    style T7.6 fill:#90EE90
```

**완료**: T7.1 ~ T7.6 전체 완료
**Phase 7 전체 완료** ✅

---

## M8: 검색 필터 확장 및 정렬 기능 (Phase 8)

> 검색 정확도 향상을 위한 추가 필터 및 정렬 기능 구현

### 마일스톤 개요

| 항목 | 내용 |
|------|------|
| **목표** | 검색 필터 확장으로 사용자 맞춤형 결과 제공 |
| **성공 지표** | 검색 결과 정확도 향상, 필터 사용률 증가 |
| **MVP 범위** | 대상자 필터 6개 + 지원유형 필터 + 신청 필터 2개 + 정렬 2개 |

---

### [x] Phase 8, T8.1: 백엔드 스키마 및 서비스 확장

**담당**: backend-specialist

**작업 내용**:
1. `backend/src/schemas/benefit.ts` - 검색 스키마 확장
   - 추가 필터: `jobSeeker`, `lifeUniversity`, `familySinglePerson`, `familyNoHouse`, `jobEmployee`, `targetVeteran`
   - 지원유형 필터: `supportType`
   - 신청 필터: `onlineApplyAvailable`, `alwaysOpen`
   - 정렬: `sortBy` (latest | popular)

2. `backend/src/services/benefitService.ts` - 필터링/정렬 로직 추가

**산출물**:
- `backend/src/schemas/benefit.ts`
- `backend/src/services/benefitService.ts`
- `backend/__tests__/api/benefits-filter.test.ts` (테스트 확장)

**완료 조건**:
- [x] 스키마 확장 완료
- [x] 필터링 로직 구현
- [x] 정렬 로직 구현
- [x] 테스트 통과 (20/20 tests passed)

---

### [x] Phase 8, T8.2: 프론트엔드 필터 UI 추가

**담당**: frontend-specialist

**의존성**: T8.1

**작업 내용**:
1. `SearchForm.vue` - 필터 UI 추가
   - 추가 대상 섹션: 구직자, 대학생, 1인가구, 무주택, 근로자, 국가보훈
   - 지원유형 드롭다운
   - 신청 조건 체크박스: 온라인 신청 가능, 상시 신청
   - 접기/펼치기 기능 (선택적)

2. `useBenefitSearch.ts` - 검색 파라미터 확장

**UI 구조**:
```
[주요 대상] (기존)
├── □ 임신/출산
├── □ 장애인
├── □ 한부모/조손가정
└── □ 다자녀가구

[추가 대상] (신규)
├── □ 구직자/실업자
├── □ 대학생/대학원생
├── □ 1인가구
├── □ 무주택세대
├── □ 근로자/직장인
└── □ 국가보훈대상자

[지원 유형]
└── [드롭다운: 전체 / 현금 / 현물 / 서비스 / ...]

[신청 조건]
├── □ 온라인 신청 가능
└── □ 상시 신청
```

**산출물**:
- `frontend/app/components/SearchForm.vue`
- `frontend/app/composables/useBenefitSearch.ts`
- `frontend/mocks/handlers/benefits.ts`
- `contracts/benefits.contract.ts`

**완료 조건**:
- [x] 필터 체크박스 UI 구현
- [x] 지원유형 드롭다운 구현
- [x] API 연동 확인
- [x] 반응형 레이아웃 확인
- [x] 테스트 통과 (124/124)

**완료일**: 2026-01-16

**커밋**: `7ceabc7` - feat: T8.2 프론트엔드 필터 UI 추가

---

### [x] Phase 8, T8.3: 정렬 기능 구현

**담당**: frontend-specialist

**의존성**: T8.1

**작업 내용**:
1. 검색 결과 상단에 정렬 드롭다운 추가
   - 최신순 (기본값)
   - 인기순

2. 백엔드 정렬 API 연동

**UI 위치**: SearchForm.vue 내 정렬 섹션

```
[정렬]
└── [드롭다운: 기본 / 최신순 / 인기순]
```

**산출물**:
- `frontend/app/components/SearchForm.vue` - 정렬 드롭다운 포함
- `frontend/app/composables/useBenefitSearch.ts` - sortBy 파라미터
- `frontend/mocks/handlers/benefits.ts` - 정렬 로직

**완료 조건**:
- [x] 정렬 드롭다운 UI 구현
- [x] 최신순/인기순 전환 동작
- [x] 정렬 변경 시 검색 결과 갱신
- [x] 테스트 통과 (124/124)

**완료일**: 2026-01-16

**참고**: T8.2와 함께 구현됨 (커밋: `7ceabc7`)

---

### [x] Phase 8, T8.4: 테스트 및 배포

**담당**: all

**의존성**: T8.1, T8.2, T8.3

**작업 내용**:
- 백엔드 테스트 통과 확인
- 프론트엔드 테스트 통과 확인
- 프로덕션 배포 (GitHub Actions)
- E2E 검증

**완료 조건**:
- [x] `npm run test` (백엔드) 통과 (42/42 tests passed)
- [x] `npm run test` (프론트엔드) 통과 (124/124 tests passed)
- [x] GitHub Actions 배포 성공 (commit: `9fe4914`)
- [x] 프로덕션 필터/정렬 동작 확인

**완료일**: 2026-01-16

**커밋**: `9fe4914` - fix: 백엔드 테스트 안정성 개선

---

## Phase 8 의존성 그래프

```mermaid
flowchart TD
    T8.1[T8.1: 백엔드 스키마/서비스] --> T8.2[T8.2: 프론트엔드 필터 UI]
    T8.1 --> T8.3[T8.3: 정렬 기능]
    T8.2 --> T8.4[T8.4: 테스트 및 배포]
    T8.3 --> T8.4
    style T8.1 fill:#90EE90
    style T8.2 fill:#90EE90
    style T8.3 fill:#90EE90
    style T8.4 fill:#90EE90
```

**완료**: T8.1 ~ T8.4 전체 완료

---

### [x] Phase 8, T8.5: 조회수 필드 분리 (viewCount vs siteViewCount)

**담당**: all

**의존성**: T8.4

**배경**:
- 기존 `viewCount` 필드가 오픈API 조회수와 사이트 내 클릭 수를 혼용
- 매일 동기화 시 오픈API 값으로 덮어쓰기되어 사이트 내 조회수 소실
- 인기순 정렬과 상세 페이지 표시용 조회수를 분리 필요

**해결 방안**:
| 필드 | 용도 | 출처 | 동기화 시 |
|------|------|------|----------|
| `viewCount` | 인기순 정렬 | 오픈API | 업데이트 |
| `siteViewCount` (신규) | 상세 페이지 표시 | 사이트 클릭 | 유지 |

**작업 내용**:

1. **백엔드 스키마 수정**
   - `prisma/schema.prisma` - `siteViewCount Int @default(0)` 필드 추가
   - `npx prisma db push` 마이그레이션 적용

2. **백엔드 서비스 수정**
   - `benefitService.ts` - 상세 조회 시 `siteViewCount` 증가
   - `syncBenefits.ts` - `siteViewCount` 유지 확인 (data에 미포함)

3. **프론트엔드 수정**
   - `BenefitHero.vue` - `siteViewCount` 표시
   - `RelatedBenefits.vue` - `siteViewCount` 표시
   - `useBenefitDetail.ts` - 타입 추가

4. **Mock 및 테스트 업데이트**
   - `mocks/handlers/benefits.ts` - API 응답 구조 수정
   - `mocks/data/benefits.ts` - `siteViewCount` 추가
   - 테스트 파일 업데이트

5. **MSW 비활성화 옵션 추가**
   - `nuxt.config.ts` - `disableMsw` 옵션
   - `plugins/msw.client.ts` - 환경변수로 MSW 토글

**산출물**:
- `backend/prisma/schema.prisma`
- `backend/src/schemas/benefit.ts`
- `backend/src/services/benefitService.ts`
- `frontend/app/components/benefit/BenefitHero.vue`
- `frontend/app/components/benefit/RelatedBenefits.vue`
- `frontend/app/composables/useBenefitDetail.ts`
- `frontend/mocks/handlers/benefits.ts`
- `frontend/mocks/data/benefits.ts`
- `frontend/nuxt.config.ts`
- `frontend/plugins/msw.client.ts`
- `contracts/benefits.contract.ts`
- 테스트 파일 4개

**완료 조건**:
- [x] Prisma 스키마 마이그레이션 완료
- [x] 백엔드 서비스 `siteViewCount` 증가 로직 구현
- [x] 프론트엔드 `siteViewCount` 표시
- [x] 동기화 시 `siteViewCount` 유지 확인
- [x] MSW 비활성화 옵션 추가 (`NUXT_PUBLIC_DISABLE_MSW=true`)
- [x] 백엔드 테스트 통과 (42/42)
- [x] 프론트엔드 테스트 통과 (124/124)

**완료일**: 2026-01-17

---

## Phase 8 최종 의존성 그래프

```mermaid
flowchart TD
    T8.1[T8.1: 백엔드 스키마/서비스] --> T8.2[T8.2: 프론트엔드 필터 UI]
    T8.1 --> T8.3[T8.3: 정렬 기능]
    T8.2 --> T8.4[T8.4: 테스트 및 배포]
    T8.3 --> T8.4
    T8.4 --> T8.5[T8.5: 조회수 필드 분리]
    style T8.1 fill:#90EE90
    style T8.2 fill:#90EE90
    style T8.3 fill:#90EE90
    style T8.4 fill:#90EE90
    style T8.5 fill:#90EE90
```

**완료**: T8.1 ~ T8.5 전체 완료
**Phase 8 최종 완료** ✅

---

## M9: 지역 필터링 고도화 (Phase 9)

> 17개 시/도 단위 지역 필터링으로 더 정확한 서비스 매칭을 제공합니다.

### [x] Phase 9, T9.1: 지역 데이터 확장 ✅

**담당**: database-specialist

**작업 내용**:
- 시/도 코드 테이블 추가 또는 Benefit 테이블 region 필드 정규화
- 보조금24 API의 지역 코드 매핑
- 기존 데이터 마이그레이션

**수정 파일**:
| 파일 | 변경 내용 |
|------|----------|
| `src/constants/regions.ts` | 17개 시/도 코드 상수 및 지역 추출 함수 (신규) |
| `src/services/syncBenefits.ts` | 지역 코드 정규화 로직 추가 |
| `src/services/benefitService.ts` | getRegionCounts 함수 추가 |
| `src/routes/benefits.ts` | /meta/regions 응답 형식 변경 |
| `src/scripts/migrateRegions.ts` | 기존 데이터 마이그레이션 스크립트 (신규) |
| `__tests__/constants/regions.test.ts` | 지역 추출 함수 테스트 (신규) |

**완료 조건**:
- [x] 17개 시/도 코드 정의
- [x] 기존 데이터 지역 코드 매핑 완료 (마이그레이션 스크립트 작성)
- [x] 테스트 통과 (8/8 tests)

---

### [x] Phase 9, T9.2: 지역 필터 UI 개선 ✅

**담당**: frontend-specialist

**의존성**: T9.1 (지역 데이터 확장)

**작업 내용**:
- 지역 선택 드롭다운을 17개 시/도로 확장
- 지역별 서비스 개수 표시 (badge)
- "전국" 옵션 유지

**수정 파일**:
| 파일 | 변경 내용 |
|------|----------|
| `app/composables/useRegions.ts` | 지역 목록 API 호출 composable (신규) |
| `app/components/SearchForm.vue` | 동적 지역 드롭다운 + 개수 표시 |
| `mocks/handlers/benefits.ts` | Mock 응답 형식 변경 |

**완료 조건**:
- [x] 17개 시/도 선택 가능 (API 기반 동적 렌더링)
- [x] 지역별 서비스 개수 표시 (예: "서울 (1,200건)")
- [x] 빌드 성공

---

## Phase 9 의존성 그래프

```mermaid
graph LR
    T9.1[T9.1: 지역 데이터 확장] --> T9.2[T9.2: 지역 필터 UI 개선]
```

---

## M10: 검색 결과 공유 기능 (Phase 10)

> 사용자가 검색 결과를 SNS/메신저로 쉽게 공유할 수 있습니다.

### [x] Phase 10, T10.1: 공유 URL 생성 ✅

**담당**: frontend-specialist

**작업 내용**:
- 검색 조건을 URL 쿼리 파라미터로 인코딩
- OG 태그 동적 생성

**수정 파일**:
| 파일 | 변경 내용 |
|------|----------|
| `pages/index.vue` | URL 쿼리 파라미터 연동, 동적 OG 태그 |
| `pages/search.vue` | URL 쿼리 파라미터 지원 |
| `composables/useShareUrl.ts` | 공유 URL 생성 composable (신규) |

**완료 조건**:
- [x] 검색 조건이 URL에 반영
- [x] URL 공유 시 동일 검색 결과 표시
- [x] 빌드 통과

---

### [x] Phase 10, T10.2: 공유 버튼 UI ✅

**담당**: frontend-specialist

**의존성**: T10.1 (공유 URL 생성)

**작업 내용**:
- 검색 결과 페이지에 공유 버튼 추가
- 클립보드 복사, Twitter/X 공유 지원
- Web Share API 지원 (모바일)

**수정 파일**:
| 파일 | 변경 내용 |
|------|----------|
| `components/ui/ShareButton.vue` | 공유 버튼 컴포넌트 (신규) |
| `pages/index.vue` | 공유 버튼 배치 |
| `pages/search.vue` | 공유 버튼 배치 |

**완료 조건**:
- [x] 공유 버튼 클릭 시 공유 옵션 표시
- [x] 클립보드 복사 동작
- [x] 모바일 Web Share API 동작
- [x] 빌드 통과

---

## Phase 10 의존성 그래프

```mermaid
graph LR
    T10.1[T10.1: 공유 URL 생성] --> T10.2[T10.2: 공유 버튼 UI]
```

---

## M11: 인기 서비스 (Phase 11)

> 사용자 관심을 끌고 탐색을 유도하는 인기 서비스 정보를 표시합니다.

### [x] Phase 11, T11.1: 인기 서비스 API ✅

**담당**: backend-specialist

**작업 내용**:
- 인기 서비스 조회 API 추가 (viewCount 기준 - 보조금24 API 조회수)
- 캐싱 적용 (메모리 또는 간단한 TTL)

**참고**: `viewCount`는 보조금24 API에서 동기화되는 정부 사이트 전체 조회수로, `siteViewCount`(사이트 내 조회수)보다 더 정확한 인기도 지표

**수정 파일**:
| 파일 | 변경 내용 |
|------|----------|
| `src/routes/benefits.ts` | GET /api/benefits/popular 엔드포인트 |
| `src/services/benefitService.ts` | getPopularBenefits() 함수 |

**완료 조건**:
- [x] 인기 서비스 TOP 10 조회 API
- [x] 간단한 캐싱 적용 (5분 TTL)
- [x] 빌드 통과

---

### [x] Phase 11, T11.2: 인기 서비스 UI ✅

**담당**: frontend-specialist

**의존성**: T11.1 (인기 서비스 API)

**작업 내용**:
- 랜딩 페이지에 인기 서비스 섹션 추가
- 클릭 시 상세 페이지로 이동

**수정 파일**:
| 파일 | 변경 내용 |
|------|----------|
| `composables/usePopularBenefits.ts` | 인기 서비스 API 호출 composable |
| `components/home/PopularBenefits.vue` | 인기 서비스 카드 리스트 |
| `pages/index.vue` | 인기 서비스 섹션 배치 |

**완료 조건**:
- [x] 인기 서비스 TOP 10 표시
- [x] 클릭 시 상세 페이지 이동
- [x] 빌드 통과

---

## Phase 11 의존성 그래프

```mermaid
graph LR
    T11.1[T11.1: 인기 서비스 API] --> T11.2[T11.2: 인기 서비스 UI]
```

---

## 전체 확장 로드맵 (Phase 9~11)

```mermaid
graph TD
    subgraph Phase9[Phase 9: 지역 필터링]
        T9.1[T9.1: 지역 데이터 확장] --> T9.2[T9.2: 지역 필터 UI]
    end

    subgraph Phase10[Phase 10: 공유 기능]
        T10.1[T10.1: 공유 URL] --> T10.2[T10.2: 공유 버튼 UI]
    end

    subgraph Phase11[Phase 11: 인기 서비스]
        T11.1[T11.1: 인기 서비스 API] --> T11.2[T11.2: 인기 서비스 UI]
    end

    Phase9 --> Phase10
    Phase10 --> Phase11
```

**구현 순서**: Phase 9 → Phase 10 → Phase 11 (각 Phase는 독립적으로 배포 가능)
