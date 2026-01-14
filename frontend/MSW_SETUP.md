# Mock Service Worker (MSW) 설정 가이드

## 개요

MSW를 사용하여 개발 환경에서 백엔드 API를 모킹합니다. 이를 통해 프론트엔드 개발을 백엔드와 독립적으로 진행할 수 있습니다.

## 설치된 패키지

- `msw@^2.x` - Mock Service Worker

## 파일 구조

```
frontend/
├── mocks/
│   ├── browser.ts              # MSW 브라우저 설정
│   ├── data/
│   │   └── benefits.ts         # Mock 지원금 데이터
│   └── handlers/
│       └── benefits.ts         # API 핸들러
├── plugins/
│   └── msw.client.ts           # Nuxt 플러그인 (개발 환경에서만 활성화)
├── public/
│   └── mockServiceWorker.js    # MSW Service Worker (자동 생성됨)
└── app/
    └── pages/
        └── test-api.vue        # Mock API 테스트 페이지
```

## 사용 방법

### 1. 개발 서버 시작

```bash
npm run dev
```

MSW가 자동으로 활성화되며, 브라우저 콘솔에 다음 메시지가 표시됩니다:

```
[MSW] Mock Service Worker가 활성화되었습니다.
```

### 2. 테스트 페이지 접근

브라우저에서 다음 URL로 이동:

```
http://localhost:3000/test-api
```

### 3. API 테스트

테스트 페이지에서 다음 기능을 확인할 수 있습니다:

#### 지원금 검색
- 나이, 소득, 지역 조건으로 지원금 필터링
- 검색 결과 실시간 표시

#### API 엔드포인트 테스트
- `GET /api/health` - 헬스 체크
- `GET /api/benefits/meta/categories` - 카테고리 목록
- `GET /api/benefits/meta/regions` - 지역 목록

## 제공되는 Mock API

### 1. 지원금 검색

**GET** `/api/benefits/search`

**쿼리 파라미터:**
- `age` (number, optional) - 나이
- `income` (number, optional) - 소득 (원 단위)
- `region` (string, optional) - 지역

**응답 예시:**
```json
{
  "benefits": [
    {
      "id": "benefit-001",
      "name": "청년도약계좌",
      "category": "금융/저축",
      "description": "만 19~34세 청년의 자산 형성을 위한 정부 지원 저축 계좌...",
      "estimatedAmount": "월 최대 33만원 (5년간)",
      "link": "https://www.kinfa.or.kr/youth",
      "minAge": 19,
      "maxAge": 34,
      "minIncome": 0,
      "maxIncome": 60000000,
      "region": "전국"
    }
  ],
  "total": 1,
  "searchParams": {
    "age": 25,
    "income": 30000000,
    "region": "서울"
  }
}
```

### 2. 지원금 상세

**GET** `/api/benefits/:id`

**응답:** 단일 지원금 객체 (404 if not found)

### 3. 메타데이터

**GET** `/api/benefits/meta/categories`
```json
{
  "categories": ["금융/저축", "주거", "취업/고용", "활동지원"]
}
```

**GET** `/api/benefits/meta/regions`
```json
{
  "regions": ["전국", "서울", "경기"]
}
```

### 4. 헬스 체크

**GET** `/api/health`
```json
{
  "status": "ok",
  "message": "MSW Mock API is running",
  "timestamp": "2026-01-14T13:00:00.000Z"
}
```

## Mock 데이터 수정

### 지원금 데이터 추가

`mocks/data/benefits.ts` 파일에서 `mockBenefits` 배열에 새로운 객체를 추가합니다:

```typescript
{
  id: 'benefit-011',
  name: '신규 지원금',
  category: '카테고리',
  description: '설명',
  estimatedAmount: '금액',
  link: 'https://example.com',
  minAge: 19,
  maxAge: 34,
  minIncome: 0,
  maxIncome: 50000000,
  region: '전국'
}
```

### API 핸들러 추가

`mocks/handlers/benefits.ts` 파일에서 새로운 엔드포인트를 추가합니다:

```typescript
http.get('/api/new-endpoint', () => {
  return HttpResponse.json({ message: 'New endpoint' }, { status: 200 });
})
```

## 프로덕션 빌드

프로덕션 빌드 시 MSW는 자동으로 비활성화됩니다 (`process.dev` 체크).

```bash
npm run build
npm run preview
```

## 주의사항

1. **개발 환경 전용**: MSW는 개발 환경에서만 활성화됩니다.
2. **Service Worker 캐시**: 브라우저를 하드 리프레시 (Cmd+Shift+R)하여 Service Worker를 갱신할 수 있습니다.
3. **HTTPS 불필요**: localhost에서는 HTTPS 없이도 Service Worker가 동작합니다.

## 트러블슈팅

### MSW가 활성화되지 않는 경우

1. 브라우저 콘솔에서 에러 확인
2. `public/mockServiceWorker.js` 파일 존재 확인
3. 개발 서버 재시작

### Service Worker 등록 실패

```bash
# MSW 재초기화
npx msw init public/ --save
```

### Mock API 응답이 없는 경우

- 브라우저 DevTools → Network 탭에서 요청 확인
- MSW 핸들러에서 엔드포인트 경로 확인
- `onUnhandledRequest: 'bypass'` 설정으로 처리되지 않은 요청은 실제 서버로 전달됨

## 참고 자료

- [MSW 공식 문서](https://mswjs.io/)
- [Nuxt 3 Plugins](https://nuxt.com/docs/guide/directory-structure/plugins)
- [API 계약 문서](/contracts/benefits.contract.ts)
