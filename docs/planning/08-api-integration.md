# API 통합 가이드 - 보조금24 공공데이터

> 행정안전부 대한민국 공공서비스 정보 (보조금24) API 통합 문서

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
```

---

## 🔌 API 엔드포인트

### 1. 공공서비스 목록 조회

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

**응답 예시**:
```json
{
  "page": 1,
  "perPage": 10,
  "totalCount": 150,
  "currentCount": 10,
  "matchCount": 150,
  "data": [
    {
      "서비스ID": "SVC001",
      "서비스명": "청년도약계좌",
      "소관기관명": "금융위원회",
      "소관기관유형": "중앙행정기관",
      "서비스분야": "금융지원",
      "서비스목적요약": "청년의 자산형성 지원",
      "신청방법": "온라인 신청",
      "선정기준": "19~34세, 연소득 7,500만원 이하",
      "서비스상세URL": "https://...",
      "등록일시": "2023-03-01T00:00:00",
      "수정일시": "2023-03-01T00:00:00"
    }
  ]
}
```

---

### 2. 공공서비스 상세내용

**엔드포인트**: `GET /gov24/v3/serviceDetail`

**용도**: 특정 서비스의 상세 정보 조회 (구비서류, 문의처 등)

**요청 파라미터**: serviceList와 동일 + 서비스ID 필터

**검색 필터**:
```
cond[서비스ID::EQ]=SVC001
```

**응답 추가 필드**:
- 서비스목적
- 지원대상
- 지원내용
- 신청기한
- 신청방법상세
- 구비서류
- 접수기관명
- 문의처전화번호

---

### 3. 공공서비스 지원조건

**엔드포인트**: `GET /gov24/v3/supportConditions`

**용도**: 서비스별 세부 지원 대상 조건 조회 (나이, 소득, 지역 등)

**요청 파라미터**:
```
serviceKey=YOUR_API_KEY
cond[서비스ID::EQ]=SVC001
```

**응답 필드**:
- 성별 (남성/여성/제한없음)
- 연령 (최소/최대)
- 소득수준 (기준중위소득 %, 절대금액)
- 직업/직군
- 가족형태
- 거주지역
- 사업자상태

**응답 예시**:
```json
{
  "data": [
    {
      "서비스ID": "SVC001",
      "성별": "제한없음",
      "최소연령": 19,
      "최대연령": 34,
      "소득기준": "연소득 7,500만원 이하",
      "거주지역": "전국",
      "가족형태": "제한없음"
    }
  ]
}
```

---

## 💻 백엔드 통합 구현

### 1. 환경변수 설정

```bash
# backend/.env
OPENAPI_SERVICE_KEY=43006692951fc050808d9f8f3fe5c5d76426bdaf2bcf308933f1aeeff539011b
OPENAPI_BASE_URL=https://api.odcloud.kr/api
```

### 2. API 클라이언트 구현

**파일**: `backend/src/services/publicApiClient.ts`

```typescript
import axios, { AxiosInstance } from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const API_KEY = process.env.OPENAPI_SERVICE_KEY
const BASE_URL = process.env.OPENAPI_BASE_URL || 'https://api.odcloud.kr/api'

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 공공서비스 목록 조회
export async function fetchServiceList(params: {
  page?: number
  perPage?: number
  serviceName?: string  // 서비스명 검색
  serviceField?: string // 서비스분야 (일자리, 주거 등)
}) {
  try {
    const response = await apiClient.get('/gov24/v3/serviceList', {
      params: {
        serviceKey: API_KEY,
        page: params.page || 1,
        perPage: params.perPage || 100,
        returnType: 'JSON',
        ...(params.serviceName && { 'cond[서비스명::LIKE]': params.serviceName }),
        ...(params.serviceField && { 'cond[서비스분야::LIKE]': params.serviceField }),
      },
    })

    return response.data
  } catch (error) {
    console.error('보조금24 API 호출 실패:', error)
    throw new Error('공공서비스 목록 조회 실패')
  }
}

// 공공서비스 지원조건 조회
export async function fetchSupportConditions(serviceId: string) {
  try {
    const response = await apiClient.get('/gov24/v3/supportConditions', {
      params: {
        serviceKey: API_KEY,
        'cond[서비스ID::EQ]': serviceId,
        returnType: 'JSON',
      },
    })

    return response.data
  } catch (error) {
    console.error('지원조건 조회 실패:', error)
    throw new Error('지원조건 조회 실패')
  }
}

// 공공서비스 상세내용 조회
export async function fetchServiceDetail(serviceId: string) {
  try {
    const response = await apiClient.get('/gov24/v3/serviceDetail', {
      params: {
        serviceKey: API_KEY,
        'cond[서비스ID::EQ]': serviceId,
        returnType: 'JSON',
      },
    })

    return response.data
  } catch (error) {
    console.error('서비스 상세 조회 실패:', error)
    throw new Error('서비스 상세 조회 실패')
  }
}

export default {
  fetchServiceList,
  fetchSupportConditions,
  fetchServiceDetail,
}
```

---

## 🔄 데이터 동기화 전략

### 전략 1: 주기적 DB 동기화 (권장)

**이유**: 공공 API는 호출 제한이 있고, 데이터 변경 빈도가 낮음

**구현 방법**:
1. 크론잡으로 매일 새벽 2시에 API 전체 데이터 가져오기
2. Prisma로 DB에 저장 (upsert)
3. 사용자 검색 시 DB에서 조회

**장점**:
- 빠른 응답 속도
- API 호출 제한 회피
- 오프라인 동작 가능

**파일**: `backend/src/services/syncBenefits.ts`

```typescript
import prisma from '../lib/prisma.js'
import { fetchServiceList, fetchSupportConditions } from './publicApiClient.js'

export async function syncAllBenefits() {
  console.log('보조금24 데이터 동기화 시작...')

  try {
    let page = 1
    let hasMore = true

    while (hasMore) {
      const response = await fetchServiceList({ page, perPage: 100 })

      for (const service of response.data) {
        // 지원조건 조회
        const conditions = await fetchSupportConditions(service.서비스ID)
        const condition = conditions.data[0] || {}

        // DB에 저장 (upsert)
        await prisma.benefit.upsert({
          where: { id: service.서비스ID },
          update: {
            name: service.서비스명,
            category: service.서비스분야,
            description: service.서비스목적요약,
            link: service.서비스상세URL,
            minAge: condition.최소연령 || null,
            maxAge: condition.최대연령 || null,
            region: condition.거주지역 || '전국',
            source: '보조금24',
            fetchedAt: new Date(),
            updatedAt: new Date(),
          },
          create: {
            id: service.서비스ID,
            name: service.서비스명,
            category: service.서비스분야,
            description: service.서비스목적요약,
            link: service.서비스상세URL,
            minAge: condition.최소연령 || null,
            maxAge: condition.최대연령 || null,
            region: condition.거주지역 || '전국',
            source: '보조금24',
            fetchedAt: new Date(),
          },
        })
      }

      hasMore = response.data.length === 100
      page++

      // Rate limiting: 요청 간 1초 대기
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log('동기화 완료!')
  } catch (error) {
    console.error('동기화 실패:', error)
    throw error
  }
}

// CLI 실행
if (require.main === module) {
  syncAllBenefits()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
```

**실행 방법**:
```bash
# 수동 실행
npm run sync:benefits

# package.json에 스크립트 추가
"scripts": {
  "sync:benefits": "tsx src/services/syncBenefits.ts"
}
```

---

### 전략 2: 실시간 API 호출 (옵션)

사용자 검색 시 직접 API 호출 (캐싱 권장)

```typescript
// backend/src/services/benefitService.ts
import { fetchServiceList } from './publicApiClient.js'

export async function searchBenefitsRealtime(params: {
  age: number
  income: number
  region: string
}) {
  // API 호출
  const response = await fetchServiceList({
    serviceName: '청년',
    serviceField: '일자리',
  })

  // 필터링 (나이, 소득, 지역)
  const filtered = response.data.filter((service: any) => {
    // 조건 필터링 로직
    return true
  })

  return filtered
}
```

---

## 🧪 테스트 코드

**파일**: `backend/__tests__/services/publicApiClient.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import { fetchServiceList, fetchSupportConditions } from '../../src/services/publicApiClient'

vi.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('보조금24 API 클라이언트', () => {
  it('서비스 목록을 조회한다', async () => {
    // Mock 응답
    mockedAxios.create.mockReturnValue({
      get: vi.fn().mockResolvedValue({
        data: {
          page: 1,
          totalCount: 100,
          data: [
            {
              서비스ID: 'SVC001',
              서비스명: '청년도약계좌',
              서비스분야: '금융지원',
            },
          ],
        },
      }),
    } as any)

    const result = await fetchServiceList({ serviceName: '청년' })

    expect(result.data).toHaveLength(1)
    expect(result.data[0].서비스명).toBe('청년도약계좌')
  })

  it('지원조건을 조회한다', async () => {
    mockedAxios.create.mockReturnValue({
      get: vi.fn().mockResolvedValue({
        data: {
          data: [
            {
              서비스ID: 'SVC001',
              최소연령: 19,
              최대연령: 34,
            },
          ],
        },
      }),
    } as any)

    const result = await fetchSupportConditions('SVC001')

    expect(result.data[0].최소연령).toBe(19)
  })
})
```

---

## 📊 데이터 매핑

### 보조금24 → Prisma Benefit 모델

| 보조금24 필드 | Prisma 필드 | 변환 로직 |
|-------------|------------|----------|
| 서비스ID | id | 그대로 사용 |
| 서비스명 | name | 그대로 사용 |
| 서비스분야 | category | 그대로 사용 |
| 서비스목적요약 | description | 그대로 사용 |
| 서비스상세URL | link | 그대로 사용 |
| 최소연령 | minAge | supportConditions에서 가져오기 |
| 최대연령 | maxAge | supportConditions에서 가져오기 |
| 거주지역 | region | supportConditions에서 가져오기 |
| 소득기준 | minIncome, maxIncome | 파싱 필요 (예: "7,500만원" → 75000000) |

---

## ⚠️ 주의사항

### 1. API 호출 제한
- **일일 호출 제한**: 공공데이터포털에서 확인 (보통 10,000회)
- **Rate Limiting**: 요청 간 1초 대기 권장
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
- 일부 서비스는 지원조건이 없을 수 있음
- 소득 기준이 텍스트 형태 (파싱 필요)
- 지역 정보가 불명확할 수 있음 ("전국", "서울특별시" 등)

---

## 🚀 다음 단계

1. ✅ API 키 발급 완료
2. ⬜ `publicApiClient.ts` 구현
3. ⬜ `syncBenefits.ts` 데이터 동기화 구현
4. ⬜ 테스트 코드 작성
5. ⬜ 첫 동기화 실행: `npm run sync:benefits`
6. ⬜ DB 데이터 확인: `npm run db:studio`
7. ⬜ 검색 API 통합: `benefitService.searchBenefits()`

---

## 📚 참고 자료

- [공공데이터포털 - 보조금24](https://www.data.go.kr/data/15113968/openapi.do)
- [Swagger API 문서](https://infuser.odcloud.kr/api/stages/44436/api-docs)
- [보조금24 공식 사이트](https://www.gov.kr/portal/rcvfvrSvc/svcFind)
