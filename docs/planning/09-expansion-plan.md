# 복지알리미 확장 계획 (재검토)

## 개요

기존 "정부 서비스" 검색에서 **일자리**, **주거/청약**, **장학금** 3개 영역으로 확장합니다.

```
현재: 복지알리미 (정부 서비스 검색)
      ↓
확장: 복지알리미 (생애주기 통합 정보 플랫폼)
      ├── 정부 서비스 (기존 Benefit)
      ├── 일자리 (Phase 1 - Job 테이블)
      ├── 주거/청약 (Phase 2 - Housing 테이블)
      └── 장학금 (Phase 3 - Scholarship 테이블)
```

## 결정 사항

| 항목 | 결정 |
|------|------|
| DB 설계 | **별도 테이블** (Job, Housing, Scholarship) |
| 구현 순서 | **일자리 → 주거 → 장학금** |
| 선행 작업 | **Phase 0** (공통 인프라) 먼저 진행 |

---

## Phase 0: 공통 인프라 구축

### 목표
확장 전 필수 인프라 작업 완료

### 0.1 레이아웃 시스템 구축

**현재 문제**: 헤더/푸터가 각 페이지에 하드코딩됨 (index.vue, search.vue, benefits/[id].vue)

**해결**: Nuxt 레이아웃 시스템 도입

```
frontend/app/
├── layouts/
│   └── default.vue        # 신규: 공통 레이아웃
├── components/
│   ├── AppHeader.vue      # 신규: 통합 헤더
│   └── AppFooter.vue      # 신규: 통합 푸터
```

**AppHeader.vue 네비게이션 구조**:
```
┌─────────────────────────────────────────────────────────┐
│  🏛️ 복지알리미     서비스  일자리  주거  장학금           │
└─────────────────────────────────────────────────────────┘
```

### 0.2 작업 목록

- [ ] P0.1: AppHeader.vue 생성 (`components/AppHeader.vue`)
- [ ] P0.2: AppFooter.vue 생성 (`components/AppFooter.vue`)
- [ ] P0.3: default.vue 레이아웃 생성 (`layouts/default.vue`)
- [ ] P0.4: 기존 페이지에서 헤더/푸터 제거 (`pages/*.vue`)
- [ ] P0.5: 빌드 및 테스트

---

## Phase 1: 일자리 검색 (고용24 API)

### 1.1 API 정보

**고용24 Open API** (구 워크넷, 2024년 9월 통합)
- **제공기관**: 한국고용정보원
- **Base URL**: `https://openapi.work24.go.kr/`
- **인증**: 고용24 자체 인증키 (별도 신청 필요)
- **응답 형식**: XML (UTF-8) → xml2js 파싱 필요

**인증키 발급 절차**:
1. 고용24 회원가입
2. Open API 인증키 신청
3. 심사 후 발급 (1~2일 소요)

**참고 링크**:
- API 소개: https://m.work24.go.kr/cm/e/a/0110/selectOpenApiIntro.do

### 1.2 데이터베이스 스키마

```prisma
model Job {
  id              String   @id @default(cuid())
  externalId      String   @unique @map("external_id")
  companyName     String   @map("company_name")
  title           String
  region          String
  jobType         String   @map("job_type")
  employmentType  String   @map("employment_type")
  education       String?
  experience      String?
  salary          String?
  deadline        DateTime?
  url             String?
  viewCount       Int      @default(0) @map("view_count")
  siteViewCount   Int      @default(0) @map("site_view_count")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@index([region])
  @@index([jobType])
  @@index([deadline])
  @@map("jobs")
}
```

### 1.3 백엔드 파일 구조

```
backend/src/
├── routes/jobs.ts
├── services/
│   ├── jobService.ts
│   └── work24ApiClient.ts
├── schemas/job.ts
└── scripts/syncJobs.ts
```

### 1.4 프론트엔드 파일 구조

```
frontend/app/
├── pages/jobs/
│   ├── index.vue
│   └── [id].vue
├── components/jobs/
│   ├── JobSearchForm.vue
│   ├── JobCard.vue
│   └── JobFilter.vue
└── composables/
    ├── useJobSearch.ts
    └── useJobDetail.ts
```

### 1.5 작업 목록

- [ ] J1.1: Prisma Job 모델 추가 + 마이그레이션
- [ ] J1.2: work24ApiClient.ts 구현 (XML 파싱)
- [ ] J1.3: syncJobs.ts 동기화 스크립트
- [ ] J1.4: jobService.ts 서비스 레이어
- [ ] J1.5: jobs.ts 라우트 구현
- [ ] J1.6: 프론트엔드 페이지/컴포넌트
- [ ] J1.7: 헤더 네비게이션 "일자리" 활성화
- [ ] J1.8: 테스트 작성

---

## Phase 2: 주거/청약 정보 (LH API)

### 2.1 API 정보

- **서비스명**: LH 공공임대주택 정보 API
- **Base URL**: `https://api.odcloud.kr/api/15058354/v1`
- **인증**: 기존 OPENAPI_SERVICE_KEY 재사용

### 2.2 데이터베이스 스키마

```prisma
model Housing {
  id              String   @id @default(cuid())
  externalId      String   @unique @map("external_id")
  name            String
  supplyType      String   @map("supply_type")
  region          String
  address         String?
  units           Int?
  moveInDate      String?  @map("move_in_date")
  status          String?
  eligibility     String?  @db.Text
  rentalCondition String?  @map("rental_condition") @db.Text
  url             String?
  viewCount       Int      @default(0) @map("view_count")
  siteViewCount   Int      @default(0) @map("site_view_count")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@index([region])
  @@index([supplyType])
  @@map("housings")
}
```

### 2.3 작업 목록

- [ ] H2.1: Prisma Housing 모델 추가
- [ ] H2.2: lhApiClient.ts 구현
- [ ] H2.3: syncHousing.ts 동기화 스크립트
- [ ] H2.4: housingService.ts 서비스 레이어
- [ ] H2.5: housing.ts 라우트 구현
- [ ] H2.6: 프론트엔드 /housing 페이지
- [ ] H2.7: 테스트 작성

---

## Phase 3: 장학금 정보 (한국장학재단 API)

### 3.1 API 정보

- **서비스명**: 한국장학재단 장학금 정보 API
- **Base URL**: `https://api.odcloud.kr/api/15059149/v1`
- **인증**: 기존 OPENAPI_SERVICE_KEY 재사용

### 3.2 데이터베이스 스키마

```prisma
model Scholarship {
  id                String    @id @default(cuid())
  externalId        String    @unique @map("external_id")
  name              String
  organization      String
  targetType        String    @map("target_type")
  selectionCount    String?   @map("selection_count")
  amount            String?
  eligibility       String?   @db.Text
  applicationStart  DateTime? @map("application_start")
  applicationEnd    DateTime? @map("application_end")
  applicationMethod String?   @map("application_method") @db.Text
  url               String?
  viewCount         Int       @default(0) @map("view_count")
  siteViewCount     Int       @default(0) @map("site_view_count")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")

  @@index([targetType])
  @@index([applicationEnd])
  @@map("scholarships")
}
```

### 3.3 작업 목록

- [ ] S3.1: Prisma Scholarship 모델 추가
- [ ] S3.2: kosafApiClient.ts 구현
- [ ] S3.3: syncScholarships.ts 동기화 스크립트
- [ ] S3.4: scholarshipService.ts 서비스 레이어
- [ ] S3.5: scholarship.ts 라우트 구현
- [ ] S3.6: 프론트엔드 /scholarship 페이지
- [ ] S3.7: 테스트 작성

---

## 환경변수 확장

```bash
# backend/.env

# 기존
OPENAPI_SERVICE_KEY=...          # 공공데이터포털
OPENAPI_BASE_URL=https://api.odcloud.kr/api

# 신규 (Phase 1)
WORK24_API_KEY=...               # 고용24 (별도 신청)
WORK24_BASE_URL=https://openapi.work24.go.kr
```

---

## 핵심 참조 파일

| 용도 | 파일 |
|------|------|
| API 클라이언트 패턴 | `backend/src/services/gov24ApiClient.ts` |
| 동기화 스크립트 패턴 | `backend/src/services/syncBenefits.ts` |
| DB 스키마 | `backend/prisma/schema.prisma` |
| 검색 서비스 패턴 | `backend/src/services/benefitService.ts` |
| composable 패턴 | `frontend/app/composables/useBenefitSearch.ts` |
| 헤더 추출 대상 | `frontend/app/pages/index.vue` |

---

## 검증 방법

```bash
# Phase 0
cd frontend && npm run build
# 모든 페이지에서 헤더/푸터 동작 확인

# Phase 1~3 (각각)
cd backend && npm run sync:jobs  # 데이터 동기화
npm run build                    # 빌드 확인
npm run test                     # 테스트 실행
```
