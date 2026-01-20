# 복지알리미 확장 계획 (3단계)

## 개요

기존 "정부 서비스" 검색에서 **일자리**, **주거/청약**, **장학금** 3개 영역으로 확장합니다.

```
현재: 복지알리미 (정부 서비스 검색)
      ↓
확장: 복지알리미 (생애주기 통합 정보 플랫폼)
      ├── 정부 서비스 (기존)
      ├── 일자리 (Phase 1)
      ├── 주거/청약 (Phase 2)
      └── 장학금 (Phase 3)
```

## 공통 사항

### 헤더 네비게이션 구조

```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ 복지알리미     서비스  일자리  주거  장학금     [검색 아이콘]  │
└─────────────────────────────────────────────────────────────────┘
```

### URL 구조 (SEO 최적화)

| 섹션 | 메인 페이지 | 상세 페이지 | 검색 결과 |
|------|------------|-----------|----------|
| 서비스 | `/` | `/benefits/:id` | `/search` |
| 일자리 | `/jobs` | `/jobs/:id` | `/jobs?keyword=...` |
| 주거 | `/housing` | `/housing/:id` | `/housing?region=...` |
| 장학금 | `/scholarship` | `/scholarship/:id` | `/scholarship?type=...` |

### 공통 컴포넌트

- `AppHeader.vue` - 네비게이션 탭 추가
- `SearchCard.vue` - 검색 결과 카드 (재사용 가능)
- `DetailLayout.vue` - 상세 페이지 레이아웃
- `Pagination.vue` - 페이지네이션

---

## Phase 1: 일자리 검색 (고용24 API)

### 1.1 API 정보

**고용24 Open API** (구 워크넷, 2024년 9월 통합)
- **제공기관**: 한국고용정보원
- **Base URL**: `https://openapi.work24.go.kr/`
- **인증**: 고용24 자체 인증키 (별도 신청 필요)
- **응답 형식**: XML (UTF-8)

**인증키 발급 절차**
1. 고용24 회원가입
2. Open API 인증키 신청
3. 심사 후 발급 (1~2일 소요)

**제공 API 종류**
| API명 | 설명 |
|-------|------|
| 채용정보 | 구인공고 목록/상세 |
| 채용행사 | 채용박람회 정보 |
| 공채속보 | 대기업 공채 정보 |
| 정부지원일자리 | 공공근로, 희망근로 등 |
| 직업정보 | 직업 상세정보 |
| 훈련과정 | 국민내일배움카드 훈련 |

**채용정보 API 응답 필드** (예상)
```json
{
  "wantedAuthNo": "K000000000001",
  "company": "주식회사 ABC",
  "title": "웹 개발자 모집",
  "region": "서울 강남구",
  "jobsCd": "024",
  "empTpCd": "정규직",
  "eduNm": "대졸",
  "career": "신입",
  "sal": "연봉 3500만원",
  "closeDt": "2026-02-28"
}
```

**참고 링크**
- API 소개: https://m.work24.go.kr/cm/e/a/0110/selectOpenApiIntro.do
- API 가이드: https://eis.work24.go.kr/eisps/opiv/selectOpivList.do

### 1.2 데이터베이스 스키마

```prisma
// prisma/schema.prisma

model Job {
  id            String   @id @default(cuid())
  externalId    String   @unique @map("external_id")  // 채용공고ID
  companyName   String   @map("company_name")
  title         String
  region        String
  jobType       String   @map("job_type")              // 직종
  employmentType String  @map("employment_type")       // 고용형태
  education     String?
  experience    String?                                 // 경력
  salary        String?
  deadline      DateTime?
  url           String?                                 // 워크넷 상세 URL
  viewCount     Int      @default(0) @map("view_count")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  @@index([region])
  @@index([jobType])
  @@index([deadline])
  @@map("jobs")
}
```

### 1.3 백엔드 구현

**파일 구조**
```
backend/src/
├── routes/
│   └── jobs.ts              # 일자리 API 라우트
├── services/
│   ├── jobService.ts        # 일자리 비즈니스 로직
│   └── jobApiClient.ts      # 워크넷 API 클라이언트
├── schemas/
│   └── job.ts               # Zod 스키마
└── scripts/
    └── syncJobs.ts          # 일자리 데이터 동기화
```

**API 엔드포인트**
| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/jobs` | 일자리 목록 (검색/필터) |
| GET | `/api/jobs/:id` | 일자리 상세 |
| GET | `/api/jobs/meta/regions` | 지역 목록 |
| GET | `/api/jobs/meta/job-types` | 직종 목록 |

### 1.4 프론트엔드 구현

**파일 구조**
```
frontend/app/
├── pages/
│   ├── jobs/
│   │   ├── index.vue        # 일자리 검색 메인
│   │   └── [id].vue         # 일자리 상세
├── components/
│   └── jobs/
│       ├── JobSearchForm.vue    # 검색 폼
│       ├── JobCard.vue          # 결과 카드
│       └── JobFilter.vue        # 필터 (지역, 직종, 경력)
└── composables/
    ├── useJobSearch.ts          # 검색 상태 관리
    └── useJobDetail.ts          # 상세 조회
```

**검색 필터**
- 지역 (시/도)
- 직종 (대분류)
- 경력 (신입/경력/무관)
- 고용형태 (정규직/계약직/인턴)

### 1.5 SEO 최적화

```typescript
// pages/jobs/index.vue
useSeoMeta({
  title: '일자리 검색 - 복지알리미',
  description: '워크넷 채용정보를 한눈에. 지역별, 직종별 맞춤 일자리를 찾아보세요.',
  ogTitle: '일자리 검색 - 복지알리미',
  ogDescription: '나에게 맞는 일자리를 찾아보세요',
})
```

### 1.6 구현 태스크

| ID | 태스크 | 예상 작업량 |
|----|-------|-----------|
| J1.1 | Prisma Job 모델 추가 | 소 |
| J1.2 | 워크넷 API 클라이언트 구현 | 중 |
| J1.3 | 일자리 동기화 스크립트 | 중 |
| J1.4 | 일자리 API 라우트 구현 | 중 |
| J1.5 | 프론트엔드 페이지/컴포넌트 | 대 |
| J1.6 | 헤더 네비게이션 업데이트 | 소 |
| J1.7 | 테스트 작성 | 중 |

---

## Phase 2: 주거/청약 정보 (LH API)

### 2.1 API 정보

**공공데이터포털 API**
- **서비스명**: LH 공공임대주택 정보 API
- **Base URL**: `https://api.odcloud.kr/api/15058354/v1`

**주요 엔드포인트**
```
GET /uddi:0db0bbe8-d145-4886-bbbe-35a9e07b8b33  # 공공임대 목록
```

**응답 필드**
```json
{
  "단지명": "행복주택 OO지구",
  "공급유형": "행복주택",
  "지역": "서울특별시",
  "주소": "서울시 강남구 ...",
  "세대수": 500,
  "입주예정일": "2026-06",
  "모집상태": "모집중",
  "신청자격": "청년, 신혼부부",
  "임대조건": "보증금 1000만원, 월세 30만원"
}
```

### 2.2 데이터베이스 스키마

```prisma
model Housing {
  id              String   @id @default(cuid())
  externalId      String   @unique @map("external_id")
  name            String                              // 단지명
  supplyType      String   @map("supply_type")        // 공급유형
  region          String
  address         String?
  units           Int?                                // 세대수
  moveInDate      String?  @map("move_in_date")       // 입주예정일
  status          String?                             // 모집상태
  eligibility     String?  @db.Text                   // 신청자격
  rentalCondition String?  @map("rental_condition") @db.Text
  url             String?
  viewCount       Int      @default(0) @map("view_count")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@index([region])
  @@index([supplyType])
  @@index([status])
  @@map("housings")
}
```

### 2.3 백엔드 구현

**API 엔드포인트**
| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/housing` | 주거정보 목록 |
| GET | `/api/housing/:id` | 주거정보 상세 |
| GET | `/api/housing/meta/regions` | 지역 목록 |
| GET | `/api/housing/meta/types` | 공급유형 목록 |

### 2.4 프론트엔드 구현

**파일 구조**
```
frontend/app/
├── pages/
│   ├── housing/
│   │   ├── index.vue        # 주거정보 메인
│   │   └── [id].vue         # 상세
├── components/
│   └── housing/
│       ├── HousingSearchForm.vue
│       ├── HousingCard.vue
│       └── HousingFilter.vue
└── composables/
    ├── useHousingSearch.ts
    └── useHousingDetail.ts
```

**검색 필터**
- 지역 (시/도)
- 공급유형 (행복주택/영구임대/국민임대/매입임대)
- 모집상태 (모집중/모집예정/마감)

### 2.5 구현 태스크

| ID | 태스크 | 예상 작업량 |
|----|-------|-----------|
| H2.1 | Prisma Housing 모델 추가 | 소 |
| H2.2 | LH API 클라이언트 구현 | 중 |
| H2.3 | 주거정보 동기화 스크립트 | 중 |
| H2.4 | 주거정보 API 라우트 구현 | 중 |
| H2.5 | 프론트엔드 페이지/컴포넌트 | 대 |
| H2.6 | 테스트 작성 | 중 |

---

## Phase 3: 장학금 정보 (한국장학재단 API)

### 3.1 API 정보

**공공데이터포털 API**
- **서비스명**: 한국장학재단 장학금 정보 API
- **Base URL**: `https://api.odcloud.kr/api/15059149/v1`

**응답 필드**
```json
{
  "장학금명": "국가장학금 I유형",
  "운영기관": "한국장학재단",
  "대상구분": "대학생",
  "선발인원": "제한없음",
  "지원금액": "연 520만원",
  "자격요건": "소득 8분위 이하",
  "신청기간": "2026-02-01 ~ 2026-03-15",
  "신청방법": "한국장학재단 홈페이지"
}
```

### 3.2 데이터베이스 스키마

```prisma
model Scholarship {
  id              String   @id @default(cuid())
  externalId      String   @unique @map("external_id")
  name            String                              // 장학금명
  organization    String                              // 운영기관
  targetType      String   @map("target_type")        // 대상구분
  selectionCount  String?  @map("selection_count")    // 선발인원
  amount          String?                             // 지원금액
  eligibility     String?  @db.Text                   // 자격요건
  applicationStart DateTime? @map("application_start")
  applicationEnd  DateTime?  @map("application_end")
  applicationMethod String? @map("application_method") @db.Text
  url             String?
  viewCount       Int      @default(0) @map("view_count")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@index([targetType])
  @@index([applicationEnd])
  @@map("scholarships")
}
```

### 3.3 백엔드 구현

**API 엔드포인트**
| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/scholarship` | 장학금 목록 |
| GET | `/api/scholarship/:id` | 장학금 상세 |
| GET | `/api/scholarship/meta/types` | 대상구분 목록 |

### 3.4 프론트엔드 구현

**파일 구조**
```
frontend/app/
├── pages/
│   ├── scholarship/
│   │   ├── index.vue        # 장학금 메인
│   │   └── [id].vue         # 상세
├── components/
│   └── scholarship/
│       ├── ScholarshipSearchForm.vue
│       ├── ScholarshipCard.vue
│       └── ScholarshipFilter.vue
└── composables/
    ├── useScholarshipSearch.ts
    └── useScholarshipDetail.ts
```

**검색 필터**
- 대상구분 (고등학생/대학생/대학원생)
- 신청상태 (신청가능/마감임박/마감)
- 키워드 검색

### 3.5 구현 태스크

| ID | 태스크 | 예상 작업량 |
|----|-------|-----------|
| S3.1 | Prisma Scholarship 모델 추가 | 소 |
| S3.2 | 장학재단 API 클라이언트 구현 | 중 |
| S3.3 | 장학금 동기화 스크립트 | 중 |
| S3.4 | 장학금 API 라우트 구현 | 중 |
| S3.5 | 프론트엔드 페이지/컴포넌트 | 대 |
| S3.6 | 테스트 작성 | 중 |

---

## 구현 우선순위

```
Phase 1 (일자리) → Phase 2 (주거) → Phase 3 (장학금)
```

**이유**:
1. **일자리**: 가장 넓은 타겟층 (20~50대), 검색량 높음, AdSense 수익 가능성
2. **주거**: 청년/신혼부부 타겟, 사회적 관심도 높음
3. **장학금**: 학생 타겟 (10~20대), 계절성 있음 (학기 시작 전 검색량 증가)

---

## 공통 인프라 변경

### 헤더 컴포넌트 수정

```vue
<!-- components/AppHeader.vue -->
<template>
  <header class="...">
    <nav>
      <NuxtLink to="/" :class="{ active: route.path === '/' || route.path.startsWith('/benefits') }">
        서비스
      </NuxtLink>
      <NuxtLink to="/jobs" :class="{ active: route.path.startsWith('/jobs') }">
        일자리
      </NuxtLink>
      <NuxtLink to="/housing" :class="{ active: route.path.startsWith('/housing') }">
        주거
      </NuxtLink>
      <NuxtLink to="/scholarship" :class="{ active: route.path.startsWith('/scholarship') }">
        장학금
      </NuxtLink>
    </nav>
  </header>
</template>
```

### Prisma 마이그레이션 전략

각 Phase 완료 시마다:
```bash
# 개발 환경
npx prisma migrate dev --name add-jobs-table

# 프로덕션
npx prisma migrate deploy
```

### 데이터 동기화 크론잡

```bash
# /etc/crontab 또는 PM2 cron
# 매일 새벽 3시 동기화
0 3 * * * cd /home/project1/alimi/backend && npm run sync:jobs
0 3 * * * cd /home/project1/alimi/backend && npm run sync:housing
0 3 * * * cd /home/project1/alimi/backend && npm run sync:scholarship
```

---

## SEO & AdSense 전략

### 각 섹션별 랜딩 페이지

- `/jobs` → "일자리 검색 - 워크넷 채용정보 한눈에"
- `/housing` → "공공임대주택 - LH 청약정보 검색"
- `/scholarship` → "장학금 찾기 - 한국장학재단 정보"

### sitemap.xml 확장

```xml
<url>
  <loc>https://알리미.com/</loc>
  <priority>1.0</priority>
</url>
<url>
  <loc>https://알리미.com/jobs</loc>
  <priority>0.9</priority>
</url>
<url>
  <loc>https://알리미.com/housing</loc>
  <priority>0.9</priority>
</url>
<url>
  <loc>https://알리미.com/scholarship</loc>
  <priority>0.9</priority>
</url>
```

### AdSense 배치

- 검색 결과 페이지: 리스트 중간 (5개마다 광고)
- 상세 페이지: 콘텐츠 하단

---

## 완료 체크리스트

### Phase 1 (일자리)
- [ ] DB 스키마 추가
- [ ] API 클라이언트 구현
- [ ] 동기화 스크립트 구현
- [ ] 백엔드 API 구현
- [ ] 프론트엔드 페이지 구현
- [ ] 헤더 네비게이션 업데이트
- [ ] 테스트 작성
- [ ] 배포 및 검증

### Phase 2 (주거)
- [ ] DB 스키마 추가
- [ ] API 클라이언트 구현
- [ ] 동기화 스크립트 구현
- [ ] 백엔드 API 구현
- [ ] 프론트엔드 페이지 구현
- [ ] 테스트 작성
- [ ] 배포 및 검증

### Phase 3 (장학금)
- [ ] DB 스키마 추가
- [ ] API 클라이언트 구현
- [ ] 동기화 스크립트 구현
- [ ] 백엔드 API 구현
- [ ] 프론트엔드 페이지 구현
- [ ] 테스트 작성
- [ ] 배포 및 검증
