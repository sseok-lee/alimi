# API 통합 가이드 - 보조금24 공공데이터

> 행정안전부 대한민국 공공서비스 정보 (보조금24) API 통합 문서
>
> **마지막 업데이트**: 2026-01-15
> **총 서비스 수**: 약 10,924개

---

## 📋 API 기본 정보

| 항목 | 내용 |
|------|------|
| 제공 기관 | 행정안전부 |
| API 유형 | REST API |
| Base URL | `https://api.odcloud.kr/api` |
| 인증 방식 | API Key (serviceKey) |
| 응답 형식 | JSON / XML |
| 비용 | 무료 |
| 승인 방식 | 자동승인 |

**API 키 관리**:
```bash
# backend/.env
OPENAPI_SERVICE_KEY=43006692951fc050808d9f8f3fe5c5d76426bdaf2bcf308933f1aeeff539011b
OPENAPI_BASE_URL=https://api.odcloud.kr/api
```

---

## 🔌 API 엔드포인트

### 1. 공공서비스 목록 조회 (serviceList)

**엔드포인트**: `GET /gov24/v3/serviceList`

**용도**: 지원금/복지 서비스 목록을 검색 조건에 따라 조회

**요청 파라미터**:

| 파라미터 | 타입 | 필수 | 설명 | 기본값 |
|---------|------|------|------|--------|
| `serviceKey` | string | O | API 인증 키 | - |
| `page` | integer | X | 페이지 번호 | 1 |
| `perPage` | integer | X | 페이지당 항목 수 | 10 |
| `returnType` | string | X | 응답 형식 (JSON/XML) | JSON |

**검색 필터 (LIKE 연산자)**:

| 파라미터 | 설명 | 예시 |
|---------|------|------|
| `cond[서비스명::LIKE]` | 서비스명 검색 | `청년` |
| `cond[소관기관유형::LIKE]` | 기관 유형 필터 | `중앙행정기관` |
| `cond[사용자구분::LIKE]` | 사용자 구분 | `개인` |
| `cond[서비스분야::LIKE]` | 서비스 분야 | `일자리`, `주거` |
| `cond[등록일시::GTE]` | 등록일 이후 | `2024-01-01` |

**실제 응답 필드**:

| 필드명 | 설명 | DB 매핑 |
|--------|------|---------|
| 서비스ID | 고유 식별자 | `id` |
| 서비스명 | 지원금 이름 | `name` |
| 서비스분야 | 카테고리 | `category` |
| 서비스목적요약 | 간략 설명 | `description` |
| 지원대상 | 대상자 정보 | `targetAudience` |
| 선정기준 | 자격 조건 | `selectionCriteria` |
| 지원내용 | 지원 금액/내용 | `supportDetails` |
| 신청방법 | 신청 방법 | `applicationMethod` |
| 신청기한 | 신청 기간 | `applicationDeadline` |
| 상세조회URL | 정부24 링크 | `link` |
| 소관기관명 | 담당 기관 | `organizationName` |
| 전화문의 | 문의처 | `contactInfo` |
| 조회수 | 인기도 | - |
| 등록일시 | 등록일 | - |
| 수정일시 | 수정일 | - |

**응답 예시**:
```json
{
  "page": 1,
  "perPage": 10,
  "totalCount": 10924,
  "currentCount": 10,
  "matchCount": 10924,
  "data": [
    {
      "서비스ID": "000000465790",
      "서비스명": "유아학비 (누리과정) 지원",
      "서비스분야": "보육·교육",
      "서비스목적요약": "유치원에 다니는 만 3~5세 아동에게 유아학비, 방과후과정비 등 지원",
      "지원대상": "○ 지원대상 : 국공립 및 사립유치원에 다니는 3~5세 유아...",
      "선정기준": "※ 2025. 3. 1~2026.2.28. 까지 적용...",
      "지원내용": "○ 3~5세에 대해 교육비를 지급합니다...",
      "신청방법": "기타 온라인신청||방문신청",
      "신청기한": "상시신청",
      "상세조회URL": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/000000465790",
      "소관기관명": "교육부",
      "전화문의": "교육부/02-6222-6060||0079에듀콜/1544-0079-5-1",
      "조회수": 351172,
      "등록일시": "20201217142613",
      "수정일시": "20251204133104"
    }
  ]
}
```

---

### 2. 공공서비스 지원조건 (supportConditions)

**엔드포인트**: `GET /gov24/v3/supportConditions`

**용도**: 서비스별 세부 지원 대상 조건 조회 (나이, 소득 매칭에 사용)

**요청 파라미터**:
```
serviceKey=YOUR_API_KEY
page=1
perPage=100
returnType=JSON
```

**응답 필드 코드 설명**:

| 코드 | 의미 | DB 매핑 |
|------|------|---------|
| **JA0101** | 남성 (Y/N) | - |
| **JA0102** | 여성 (Y/N) | - |
| **JA0110** | 대상연령(시작) | `minAge` |
| **JA0111** | 대상연령(종료) | `maxAge` |
| **JA0201** | 중위소득 0~50% | `incomeLevel0to50` |
| **JA0202** | 중위소득 51~75% | `incomeLevel51to75` |
| **JA0203** | 중위소득 76~100% | `incomeLevel76to100` |
| **JA0204** | 중위소득 101~200% | `incomeLevel101to200` |
| **JA0205** | 중위소득 200% 초과 | `incomeLevelOver200` |
| **JA0322** | 해당사항없음 | - |
| 서비스ID | 서비스 식별자 | - |
| 서비스명 | 서비스 이름 | - |

**응답 예시**:
```json
{
  "currentCount": 2,
  "page": 1,
  "perPage": 2,
  "totalCount": 10924,
  "data": [
    {
      "서비스ID": "000000465790",
      "서비스명": "유아학비 (누리과정) 지원",
      "JA0101": "Y",
      "JA0102": "Y",
      "JA0110": 3,
      "JA0111": 5,
      "JA0201": "Y",
      "JA0202": "Y",
      "JA0203": "Y",
      "JA0204": "Y",
      "JA0205": "Y"
    }
  ]
}
```

---

### 3. 공공서비스 상세내용 (serviceDetail)

**엔드포인트**: `GET /gov24/v3/serviceDetail`

**용도**: 특정 서비스의 상세 정보 조회 (구비서류, 온라인신청URL 등)

**요청 파라미터**:
```
serviceKey=YOUR_API_KEY
cond[서비스ID::EQ]=000000465790
returnType=JSON
```

**추가 응답 필드** (serviceList에 없는 필드):

| 필드명 | 설명 | DB 매핑 |
|--------|------|---------|
| 서비스목적 | 상세 목적 | - |
| 구비서류 | 필요 서류 목록 | `requiredDocuments` |
| 온라인신청사이트URL | 직접 신청 링크 | `onlineApplyUrl` |
| 법령 | 관련 법령 | - |
| 자치법규 | 관련 자치법규 | - |
| 접수기관명 | 접수 기관 | - |
| 문의처 | 문의 연락처 | - |

**응답 예시**:
```json
{
  "data": [
    {
      "서비스ID": "000000465790",
      "서비스명": "유아학비 (누리과정) 지원",
      "서비스목적": "3~5세 누리과정 도입으로 유치원·어린이집에 국가수준 공통 교육과정...",
      "구비서류": "- 사회복지서비스 및 급여제공(변경) 신청서\n- 아이사랑 카드발급 신청...",
      "온라인신청사이트URL": "https://www.bokjiro.go.kr",
      "법령": "유아교육법(제24조)||유아교육법 시행령(제29조)",
      "문의처": "교육부/02-6222-6060||0079에듀콜/1544-0079-5-1"
    }
  ]
}
```

---

## 🔄 데이터 동기화 전략

### 선택된 전략: 하이브리드 동기화 (옵션 B)

**개요**:
1. **초기 동기화**: serviceList + supportConditions (2-3시간)
2. **상세 정보**: 사용자가 상세 조회 시 serviceDetail 온디맨드 호출 + DB 캐싱

**장점**:
- 빠른 MVP 출시 가능
- 검색/매칭 기능 즉시 동작
- 필요할 때만 상세 정보 로드 (효율적)
- API 호출 제한 회피

**단점**:
- 첫 상세 조회 시 약간의 지연 (API 호출)
- 상세 정보가 없는 상태에서 검색 결과 표시

---

### 동기화 단계

#### 1단계: 기본 동기화 (필수)

**소요 시간**: 약 2-3시간 (10,924개 × 2 API 호출 × 1초)

**실행**:
```bash
npm run sync:benefits
```

**수집 데이터**:
- serviceList: 기본 정보 (이름, 카테고리, 설명, 신청기한 등)
- supportConditions: 매칭 조건 (나이, 소득 수준)

#### 2단계: 상세 정보 온디맨드 (선택)

**트리거**: 사용자가 지원금 상세 페이지 조회 시

**로직**:
```typescript
async function getBenefitDetail(id: string) {
  // 1. DB에서 조회
  const benefit = await prisma.benefit.findUnique({ where: { id } })

  // 2. 상세 정보가 없으면 API 호출
  if (!benefit.requiredDocuments || !benefit.onlineApplyUrl) {
    const detail = await fetchServiceDetail(id)

    // 3. DB 업데이트
    await prisma.benefit.update({
      where: { id },
      data: {
        requiredDocuments: detail.data[0]?.구비서류,
        onlineApplyUrl: detail.data[0]?.온라인신청사이트URL,
        detailFetchedAt: new Date()
      }
    })
  }

  return benefit
}
```

---

## 📊 데이터 매핑

### 보조금24 → Prisma Benefit 모델 (전체)

#### serviceList 필드 (기본 동기화)

| 보조금24 필드 | Prisma 필드 | 타입 | 설명 |
|-------------|------------|------|------|
| 서비스ID | `id` | String | PK |
| 서비스명 | `name` | String | 지원금 이름 |
| 서비스분야 | `category` | String | 카테고리 |
| 서비스목적요약 | `description` | String? | 간략 설명 |
| 지원대상 | `targetAudience` | String? | 대상자 정보 |
| 선정기준 | `selectionCriteria` | String? | 자격 조건 |
| 지원내용 | `supportDetails` | String? | 지원 금액/내용 |
| 신청방법 | `applicationMethod` | String? | 신청 방법 |
| 신청기한 | `applicationDeadline` | String? | 신청 기간 |
| 상세조회URL | `link` | String | 정부24 링크 |
| 소관기관명 | `organizationName` | String? | 담당 기관 |
| 전화문의 | `contactInfo` | String? | 문의처 |
| 지원유형 | `supportType` | String? | 현금/현물/서비스 등 |
| 사용자구분 | `userType` | String? | 개인/가구/법인 |
| 접수기관명 | `applyAgency` | String? | 접수 기관 |
| 조회수 | `viewCount` | Int? | 인기순 정렬용 |

#### supportConditions 필드 (매칭 조건 - 총 50개 JA 코드)

##### 성별

| 보조금24 코드 | Prisma 필드 | 타입 | 설명 |
|-------------|------------|------|------|
| JA0101 | `targetMale` | Boolean? | 남성 |
| JA0102 | `targetFemale` | Boolean? | 여성 |

##### 연령

| 보조금24 코드 | Prisma 필드 | 타입 | 설명 |
|-------------|------------|------|------|
| JA0110 | `minAge` | Int? | 대상연령(시작) |
| JA0111 | `maxAge` | Int? | 대상연령(종료) |

##### 소득 수준

| 보조금24 코드 | Prisma 필드 | 타입 | 설명 |
|-------------|------------|------|------|
| JA0201 | `incomeLevel0to50` | Boolean? | 중위소득 0~50% |
| JA0202 | `incomeLevel51to75` | Boolean? | 중위소득 51~75% |
| JA0203 | `incomeLevel76to100` | Boolean? | 중위소득 76~100% |
| JA0204 | `incomeLevel101to200` | Boolean? | 중위소득 101~200% |
| JA0205 | `incomeLevelOver200` | Boolean? | 중위소득 200% 초과 |

##### 생애주기

| 보조금24 코드 | Prisma 필드 | 타입 | 설명 |
|-------------|------------|------|------|
| JA0301 | `lifePregnancyPlan` | Boolean? | 예비부모/난임 |
| JA0302 | `lifePregnant` | Boolean? | 임산부 |
| JA0303 | `lifeBirth` | Boolean? | 출산/입양 |

##### 학생

| 보조금24 코드 | Prisma 필드 | 타입 | 설명 |
|-------------|------------|------|------|
| JA0317 | `lifeElementary` | Boolean? | 초등학생 |
| JA0318 | `lifeMiddleSchool` | Boolean? | 중학생 |
| JA0319 | `lifeHighSchool` | Boolean? | 고등학생 |
| JA0320 | `lifeUniversity` | Boolean? | 대학생/대학원생 |

##### 직업

| 보조금24 코드 | Prisma 필드 | 타입 | 설명 |
|-------------|------------|------|------|
| JA0313 | `jobFarmer` | Boolean? | 농업인 |
| JA0314 | `jobFisherman` | Boolean? | 어업인 |
| JA0315 | `jobLivestock` | Boolean? | 축산업인 |
| JA0316 | `jobForester` | Boolean? | 임업인 |
| JA0326 | `jobEmployee` | Boolean? | 근로자/직장인 |
| JA0327 | `jobSeeker` | Boolean? | 구직자/실업자 |

##### 특수 상황

| 보조금24 코드 | Prisma 필드 | 타입 | 설명 |
|-------------|------------|------|------|
| JA0328 | `targetDisabled` | Boolean? | 장애인 |
| JA0329 | `targetVeteran` | Boolean? | 국가보훈대상자 |
| JA0330 | `targetDisease` | Boolean? | 질병/질환자 |

##### 가족 상황

| 보조금24 코드 | Prisma 필드 | 타입 | 설명 |
|-------------|------------|------|------|
| JA0401 | `familyMulticultural` | Boolean? | 다문화가족 |
| JA0402 | `familyNKDefector` | Boolean? | 북한이탈주민 |
| JA0403 | `familySingleParent` | Boolean? | 한부모/조손가정 |
| JA0404 | `familySinglePerson` | Boolean? | 1인가구 |
| JA0411 | `familyMultiChild` | Boolean? | 다자녀가구 |
| JA0412 | `familyNoHouse` | Boolean? | 무주택세대 |
| JA0413 | `familyNewResident` | Boolean? | 신규전입 |

#### serviceDetail 필드 (온디맨드)

| 보조금24 필드 | Prisma 필드 | 타입 | 설명 |
|-------------|------------|------|------|
| 구비서류 | `requiredDocuments` | String? | 필요 서류 |
| 공무원확인구비서류 | `officialConfirmDocs` | String? | 공무원 확인 서류 |
| 본인확인필요구비서류 | `identityConfirmDocs` | String? | 본인 확인 서류 |
| 온라인신청사이트URL | `onlineApplyUrl` | String? | 직접 신청 링크 |
| 법령 | `relatedLaws` | String? | 관련 법령 |

---

## 💻 백엔드 구현

### 1. 환경변수 설정

```bash
# backend/.env
OPENAPI_SERVICE_KEY=43006692951fc050808d9f8f3fe5c5d76426bdaf2bcf308933f1aeeff539011b
OPENAPI_BASE_URL=https://api.odcloud.kr/api
```

### 2. Prisma 스키마

> 전체 스키마는 `backend/prisma/schema.prisma` 파일 참조

```prisma
model Benefit {
  id              String   @id // 보조금24 서비스ID 사용
  name            String   @db.VarChar(255)
  category        String   @db.VarChar(100)
  description     String?  @db.Text

  // ===== serviceList 필드 (기본 동기화) =====
  targetAudience      String?  @map("target_audience") @db.Text
  selectionCriteria   String?  @map("selection_criteria") @db.Text
  supportDetails      String?  @map("support_details") @db.Text
  applicationMethod   String?  @map("application_method") @db.VarChar(500)
  applicationDeadline String?  @map("application_deadline") @db.VarChar(255)
  organizationName    String?  @map("organization_name") @db.VarChar(255)
  contactInfo         String?  @map("contact_info") @db.Text
  link                String   @db.VarChar(500)
  supportType         String?  @map("support_type") @db.VarChar(100)   // 지원유형
  userType            String?  @map("user_type") @db.VarChar(50)       // 사용자구분
  applyAgency         String?  @map("apply_agency") @db.VarChar(255)   // 접수기관
  viewCount           Int?     @map("view_count")                      // 조회수

  // ===== supportConditions 필드 (나이/소득/대상 매칭용) =====
  // 성별 (JA0101, JA0102)
  targetMale          Boolean? @map("target_male")
  targetFemale        Boolean? @map("target_female")

  // 연령 (JA0110, JA0111)
  minAge              Int?     @map("min_age")
  maxAge              Int?     @map("max_age")

  // 소득 수준 (JA0201~JA0205)
  incomeLevel0to50    Boolean? @map("income_level_0_50")
  incomeLevel51to75   Boolean? @map("income_level_51_75")
  incomeLevel76to100  Boolean? @map("income_level_76_100")
  incomeLevel101to200 Boolean? @map("income_level_101_200")
  incomeLevelOver200  Boolean? @map("income_level_over_200")

  // 생애주기 (JA0301~JA0303)
  lifePregnancyPlan   Boolean? @map("life_pregnancy_plan")
  lifePregnant        Boolean? @map("life_pregnant")
  lifeBirth           Boolean? @map("life_birth")

  // 학생 (JA0317~JA0320)
  lifeElementary      Boolean? @map("life_elementary")
  lifeMiddleSchool    Boolean? @map("life_middle_school")
  lifeHighSchool      Boolean? @map("life_high_school")
  lifeUniversity      Boolean? @map("life_university")

  // 직업 (JA0313~JA0316, JA0326~JA0327)
  jobFarmer           Boolean? @map("job_farmer")
  jobFisherman        Boolean? @map("job_fisherman")
  jobLivestock        Boolean? @map("job_livestock")
  jobForester         Boolean? @map("job_forester")
  jobEmployee         Boolean? @map("job_employee")
  jobSeeker           Boolean? @map("job_seeker")

  // 특수 상황 (JA0328~JA0330)
  targetDisabled      Boolean? @map("target_disabled")
  targetVeteran       Boolean? @map("target_veteran")
  targetDisease       Boolean? @map("target_disease")

  // 가족 상황 (JA0401~JA0413)
  familyMulticultural Boolean? @map("family_multicultural")
  familyNKDefector    Boolean? @map("family_nk_defector")
  familySingleParent  Boolean? @map("family_single_parent")
  familySinglePerson  Boolean? @map("family_single_person")
  familyMultiChild    Boolean? @map("family_multi_child")
  familyNoHouse       Boolean? @map("family_no_house")
  familyNewResident   Boolean? @map("family_new_resident")

  // ===== serviceDetail 필드 (온디맨드 조회) =====
  requiredDocuments     String?  @map("required_documents") @db.Text
  officialConfirmDocs   String?  @map("official_confirm_docs") @db.Text
  identityConfirmDocs   String?  @map("identity_confirm_docs") @db.Text
  onlineApplyUrl        String?  @map("online_apply_url") @db.VarChar(500)
  relatedLaws           String?  @map("related_laws") @db.Text
  detailFetchedAt       DateTime? @map("detail_fetched_at")

  // ===== 레거시 필드 (하위 호환성 유지) =====
  estimatedAmount String?  @map("estimated_amount") @db.VarChar(100)
  eligibility     Json?
  minIncome       Int?     @map("min_income")
  maxIncome       Int?     @map("max_income")
  region          String?  @db.VarChar(50)

  // ===== 메타데이터 =====
  source          String?  @db.VarChar(100)
  fetchedAt       DateTime @default(now()) @map("fetched_at")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  // ===== 인덱스 =====
  @@index([category])
  @@index([supportType])
  @@index([minAge, maxAge])
  @@index([viewCount(sort: Desc)])
  @@index([fetchedAt(sort: Desc)])
  @@index([incomeLevel0to50, incomeLevel51to75, incomeLevel76to100, incomeLevel101to200, incomeLevelOver200])
  @@index([lifePregnancyPlan, lifePregnant, lifeBirth])
  @@index([lifeElementary, lifeMiddleSchool, lifeHighSchool, lifeUniversity])
  @@index([familySingleParent, familySinglePerson, familyMultiChild, familyNoHouse])
  @@map("benefits")
}
```

### 3. npm 스크립트

```json
{
  "scripts": {
    "sync:benefits": "tsx src/services/syncBenefits.ts"
  }
}
```

---

## ⚠️ 주의사항

### 1. API 호출 제한
- **일일 호출 제한**: 공공데이터포털에서 확인 (보통 10,000회)
- **Rate Limiting**: 요청 간 1초 대기 필수
- **타임아웃**: 10초 설정 (네트워크 지연 대비)

### 2. 에러 핸들링
```typescript
try {
  const data = await fetchServiceList(params)
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      console.error('API 호출 제한 초과')
    } else if (error.response?.status === 401) {
      console.error('API 키 인증 실패')
    }
  }
  // Fallback: DB 캐시 데이터 사용
  return fallbackData
}
```

### 3. 데이터 품질
- 일부 서비스는 지원조건이 없을 수 있음 (JA 코드가 null)
- 신청기한 형식이 일정하지 않음 ("상시신청", "5.1.~5.31." 등)
- 텍스트 필드에 줄바꿈(`\r\n`) 포함

---

## 🚀 구현 체크리스트

1. ✅ API 키 발급 완료
2. ✅ Prisma 스키마 확장 (40+ 필드 추가 완료)
3. ✅ `gov24ApiClient.ts` - 보조금24 API 함수 구현
4. ✅ `syncBenefits.ts` - 기본 동기화 스크립트 구현
5. ⬜ `benefitService.ts` - 상세 정보 온디맨드 조회 추가
6. ✅ 첫 동기화 실행: `npm run sync:benefits` (10,924개 완료)
7. ✅ DB 데이터 확인: `npm run db:studio`
8. ✅ 검색 API 통합 테스트
9. ✅ 프론트엔드 연동 테스트
10. ✅ 검색 필터 확장 (T4.4) - MVP 완료 (지역 필터 제외)

---

## 🔍 검색 API 확장 (T4.4)

### 현재 검색 API

**엔드포인트**: `POST /api/benefits/search`

**현재 파라미터**:
```typescript
interface BenefitSearchRequest {
  age?: number;      // 나이
  income?: number;   // 연소득
  region?: string;   // 지역
}
```

**문제점**: 결과가 8,000개 이상으로 너무 많음

---

### 확장된 검색 API (계획)

**추가 파라미터**:
```typescript
interface BenefitSearchRequest {
  // 기존 필터
  age?: number;
  income?: number;
  region?: string;

  // 신규 필터 (MVP)
  category?: string;            // 카테고리 (보육·교육, 주거·자립 등)
  lifePregnancy?: boolean;      // 임신/출산 관련
  targetDisabled?: boolean;     // 장애인
  familySingleParent?: boolean; // 한부모/조손가정
  familyMultiChild?: boolean;   // 다자녀가구
}
```

### 카테고리 목록

| 카테고리 | 데이터 수 |
|---------|----------|
| 생활안정 | 2,248개 |
| 농림축산어업 | 1,721개 |
| 보육·교육 | 1,500개 |
| 보건·의료 | 1,214개 |
| 임신·출산 | 906개 |
| 고용·창업 | 842개 |
| 문화·환경 | 647개 |
| 보호·돌봄 | 642개 |
| 행정·안전 | 634개 |
| 주거·자립 | 570개 |

### 대상 조건 필터

| 필터 | DB 필드 | 해당 데이터 |
|------|---------|------------|
| 임신/출산 | `lifePregnant`, `lifeBirth`, `lifePregnancyPlan` | ~3,500개 |
| 장애인 | `targetDisabled` | 3,740개 |
| 한부모/조손가정 | `familySingleParent` | 7,815개 |
| 다자녀가구 | `familyMultiChild` | 7,910개 |

### 예상 효과

| 필터 조합 | 예상 결과 수 |
|-----------|-------------|
| 27세 + 서울 | ~8,000개 |
| 27세 + 서울 + **보육·교육** | ~800개 |
| 27세 + 서울 + 보육·교육 + **임신/출산** | ~100개 |

---

## 🚧 MVP 현황 및 제한사항 (2026-01-15)

### 구현 완료

| 필터 | 상태 | 비고 |
|------|------|------|
| 나이 (age) | ✅ 동작 | minAge/maxAge 범위 매칭 |
| 소득 (income) | ✅ 동작 | 중위소득 구간별 매칭 |
| 카테고리 (category) | ✅ 동작 | 10개 카테고리 필터 |
| 임신/출산 (lifePregnancy) | ✅ 동작 | lifePregnant, lifeBirth, lifePregnancyPlan 매칭 |
| 장애인 (targetDisabled) | ✅ 동작 | targetDisabled=true 필터 |
| 한부모/조손 (familySingleParent) | ✅ 동작 | familySingleParent=true 필터 |
| 다자녀가구 (familyMultiChild) | ✅ 동작 | familyMultiChild=true 필터 |

### 미구현 (향후 개선)

| 필터 | 상태 | 원인 | 해결 방안 |
|------|------|------|----------|
| 지역 (region) | ⚠️ 미동작 | DB의 `region` 컬럼이 모두 NULL | `organizationName` 필드에서 지역 추출 필요 (예: "서울특별시 동대문구" → "서울") |

### 지역 필터 개선 계획

현재 보조금24 API에서 별도의 지역 필드를 제공하지 않습니다.
`organizationName` (소관기관명) 필드에 지역 정보가 포함되어 있어, 향후 다음과 같이 개선 가능합니다:

```typescript
// 소관기관명에서 지역 추출 (예시)
function extractRegion(organizationName: string): string | null {
  const regionPatterns = [
    { pattern: /서울/, region: '서울' },
    { pattern: /경기/, region: '경기' },
    { pattern: /인천/, region: '인천' },
    { pattern: /부산/, region: '부산' },
    // ... 17개 광역시/도
  ]

  for (const { pattern, region } of regionPatterns) {
    if (pattern.test(organizationName)) {
      return region
    }
  }
  return '전국' // 중앙부처 등
}
```

---

## 📚 참고 자료

- [공공데이터포털 - 보조금24](https://www.data.go.kr/data/15113968/openapi.do)
- [Swagger API 문서](https://infuser.odcloud.kr/api/stages/44436/api-docs)
- [보조금24 공식 사이트](https://www.gov.kr/portal/rcvfvrSvc/svcFind)
