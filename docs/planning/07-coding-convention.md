# Coding Convention & AI Collaboration Guide

> 고품질/유지보수/보안을 위한 인간-AI 협업 운영 지침서입니다.

---

## MVP 캡슐

| # | 항목 | 내용 |
|---|------|------|
| 1 | 목표 | 20~30대 청년층이 공공데이터 기반으로 맞춤형 지원금을 쉽게 찾을 수 있는 서비스 제공 |
| 2 | 페르소나 | 20~30대 청년층 전체 (취업준비생, 직장인, 프리랜서, 신혼부부 등) |
| 3 | 핵심 기능 | FEAT-1: 나이/소득/지역 입력 맞춤형 지원금 매칭 |
| 4 | 성공 지표 (노스스타) | 월 애드센스 수익 목표 달성 |
| 5 | 입력 지표 | 일 방문자 수(DAU), 검색 전환율 |
| 6 | 비기능 요구 | SEO 최적화 (구글 검색 노출), 페이지 로딩 속도 < 3초 |
| 7 | Out-of-scope | 소셜 로그인, 이메일 알림, 복잡한 필터링은 v2 이후 |
| 8 | Top 리스크 | 공공데이터 API 불안정 또는 데이터 품질 문제 |
| 9 | 완화/실험 | 여러 공공 API 소스 통합, 데이터 캐싱 전략 수립 |
| 10 | 다음 단계 | Phase 0 계약 정의 및 테스트 케이스 작성 시작 |

---

## 1. 핵심 원칙

### 1.1 신뢰하되, 검증하라 (Don't Trust, Verify)

AI가 생성한 코드는 반드시 검증해야 합니다:

- [ ] 코드 리뷰: 생성된 코드 직접 확인
- [ ] 테스트 실행: 자동화 테스트 통과 확인
- [ ] 보안 검토: 민감 정보 노출 여부 확인
- [ ] 동작 확인: 실제로 실행하여 기대 동작 확인

### 1.2 최종 책임은 인간에게

- AI는 도구이고, 최종 결정과 책임은 개발자에게 있습니다
- 이해하지 못하는 코드는 사용하지 않습니다
- 의심스러운 부분은 반드시 질문합니다

---

## 2. 프로젝트 구조

### 2.1 디렉토리 구조

```
welfare-notifier/
├── frontend/
│   ├── components/       # 재사용 컴포넌트
│   │   ├── BenefitCard.vue
│   │   ├── SearchForm.vue
│   │   └── ui/          # 공통 UI (Button, Input 등)
│   ├── pages/           # Nuxt 페이지
│   │   ├── index.vue    # 랜딩 페이지
│   │   └── search.vue   # 검색 결과 페이지
│   ├── composables/     # Vue Composition API
│   │   └── useBenefitSearch.ts
│   ├── utils/           # 유틸리티 함수
│   │   └── format.ts
│   ├── stores/          # Pinia 스토어
│   │   └── search.ts
│   ├── types/           # TypeScript 타입
│   │   └── benefit.ts
│   └── tests/
├── backend/
│   ├── app/
│   │   ├── main.py      # FastAPI 앱 엔트리포인트
│   │   ├── models/      # SQLAlchemy 모델
│   │   │   └── benefit.py
│   │   ├── routes/      # API 라우트
│   │   │   └── benefits.py
│   │   ├── schemas/     # Pydantic 스키마
│   │   │   └── benefit.py
│   │   ├── services/    # 비즈니스 로직
│   │   │   ├── benefit_service.py
│   │   │   └── api_client.py
│   │   └── utils/       # 유틸리티
│   │       └── logging.py
│   └── tests/
├── contracts/           # API 계약 (BE/FE 공유)
│   └── benefits.contract.ts
├── docs/
│   └── planning/        # 기획 문서 (소크라테스 산출물)
│       ├── 01-prd.md
│       ├── 02-trd.md
│       ├── 03-user-flow.md
│       ├── 04-database-design.md
│       ├── 05-design-system.md
│       └── 07-coding-convention.md
├── docker-compose.yml
└── README.md
```

### 2.2 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 파일 (Vue 컴포넌트) | PascalCase | `BenefitCard.vue` |
| 파일 (TypeScript) | camelCase | `useBenefitSearch.ts` |
| 파일 (Python) | snake_case | `benefit_service.py` |
| Vue 컴포넌트 | PascalCase | `BenefitCard` |
| 함수/변수 | camelCase | `getBenefitById` |
| 상수 | UPPER_SNAKE | `MAX_RETRY_COUNT` |
| CSS 클래스 | kebab-case | `benefit-card` |
| Pydantic 모델 | PascalCase | `BenefitResponse` |

---

## 3. 아키텍처 원칙

### 3.1 뼈대 먼저 (Skeleton First)

1. 전체 구조를 먼저 잡고
2. 빈 함수/컴포넌트로 스켈레톤 생성
3. 하나씩 구현 채워나가기

### 3.2 작은 모듈로 분해

- 한 파일에 200줄 이하 권장
- 한 함수에 50줄 이하 권장
- 한 컴포넌트에 100줄 이하 권장

### 3.3 관심사 분리

| 레이어 | 역할 | 예시 |
|--------|------|------|
| UI | 화면 표시 | Vue 컴포넌트 |
| 상태 | 데이터 관리 | Pinia 스토어 |
| 서비스 | API 통신 | Composables (useBenefitSearch) |
| 유틸 | 순수 함수 | 날짜 포맷, 금액 포맷 |

---

## 4. AI 소통 원칙

### 4.1 하나의 채팅 = 하나의 작업

- 한 번에 하나의 명확한 작업만 요청
- 작업 완료 후 다음 작업 진행
- 컨텍스트가 길어지면 새 대화 시작

### 4.2 컨텍스트 명시

**좋은 예:**
> "TASKS 문서의 T1.1을 구현해주세요.
> Database Design의 BENEFIT 테이블을 참조하고,
> TRD의 FastAPI + Pydantic 스키마를 사용해주세요."

**나쁜 예:**
> "API 만들어줘"

### 4.3 기존 코드 재사용

- 새로 만들기 전에 기존 코드 확인 요청
- 중복 코드 방지
- 일관성 유지

### 4.4 프롬프트 템플릿

```
## 작업
{무엇을 해야 하는지}

## 참조 문서
- 01-prd.md 섹션 3.1
- 04-database-design.md BENEFIT 테이블

## 제약 조건
- FastAPI 사용
- Pydantic validation 필수
- 테스트 커버리지 80% 이상

## 예상 결과
- backend/app/routes/benefits.py
- backend/tests/api/test_benefits.py
- 검색 API: GET /api/v1/benefits/search
```

---

## 5. 보안 체크리스트

### 5.1 절대 금지

- [ ] 비밀정보 하드코딩 금지 (API 키, 비밀번호, 토큰)
- [ ] .env 파일 커밋 금지
- [ ] SQL 직접 문자열 조합 금지 (SQL Injection)
- [ ] 사용자 입력 그대로 출력 금지 (XSS)

### 5.2 필수 적용

- [ ] 모든 사용자 입력 검증 (서버 측 Pydantic)
- [ ] 환경 변수로 비밀 정보 관리 (.env)
- [ ] HTTPS 사용 (Vercel/Railway 기본 제공)
- [ ] CORS 설정 (프론트엔드 도메인만 허용)

### 5.3 환경 변수 관리

```bash
# .env.example (커밋 O)
DATABASE_URL=mysql://user:password@localhost:3306/welfare
PUBLIC_DATA_API_KEY=your-api-key-here
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000

# .env (커밋 X, .gitignore에 추가)
DATABASE_URL=mysql://real:real@prod:3306/welfare
PUBLIC_DATA_API_KEY=abc123xyz789
NUXT_PUBLIC_API_BASE_URL=https://api.welfare-notifier.com
```

---

## 6. 테스트 워크플로우

### 6.1 즉시 실행 검증

코드 작성 후 바로 테스트:

```bash
# 백엔드
cd backend
pytest tests/ -v --cov=app

# 프론트엔드
cd frontend
npm run test

# E2E
npx playwright test
```

### 6.2 오류 로그 공유 규칙

오류 발생 시 AI에게 전달할 정보:

1. 전체 에러 메시지
2. 관련 코드 스니펫
3. 재현 단계
4. 이미 시도한 해결책

**예시:**
```
## 에러
ValidationError: age must be between 0 and 150

## 코드
@app.post("/api/v1/benefits/search")
async def search_benefits(request: BenefitSearchRequest):
    # line 42

## 재현
1. age = -1 입력
2. POST /api/v1/benefits/search

## 시도한 것
- Pydantic Field(ge=0)로 검증 추가 → 여전히 실패
```

---

## 7. Git 워크플로우

### 7.1 브랜치 전략

```
main          # 프로덕션
├── develop   # 개발 통합
│   ├── feature/feat-1-search
│   ├── feature/feat-0-landing
│   └── fix/api-timeout
```

### 7.2 커밋 메시지

```
<type>(<scope>): <subject>

<body>
```

**타입:**
- `feat`: 새 기능
- `fix`: 버그 수정
- `refactor`: 리팩토링
- `docs`: 문서
- `test`: 테스트
- `chore`: 기타

**예시:**
```
feat(search): 나이/소득/지역 기반 지원금 검색 API 추가

- GET /api/v1/benefits/search 엔드포인트 구현
- Pydantic validation으로 입력 검증
- Database Design 섹션 2.1 BENEFIT 테이블 참조
- 테스트 커버리지 85%
```

---

## 8. 코드 품질 도구

### 8.1 필수 설정

| 도구 | 프론트엔드 | 백엔드 |
|------|-----------|--------|
| 린터 | ESLint | Ruff |
| 포매터 | Prettier | Black |
| 타입 체크 | TypeScript (tsc) | mypy (선택) |

### 8.2 Pre-commit 훅

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      # 프론트엔드
      - id: eslint
        name: ESLint
        entry: npm run lint --prefix frontend
        language: system
        pass_filenames: false

      # 백엔드
      - id: ruff
        name: Ruff
        entry: ruff check backend/
        language: system
        pass_filenames: false

      - id: black
        name: Black
        entry: black backend/
        language: system
        pass_filenames: false
```

---

## 9. 프론트엔드 규약 (Vue 3 + Nuxt)

### 9.1 Vue 컴포넌트 구조

```vue
<template>
  <!-- 단일 루트 요소 -->
  <div class="benefit-card">
    <!-- HTML -->
  </div>
</template>

<script setup lang="ts">
// 1. imports
import { ref, computed } from 'vue'
import type { Benefit } from '~/types/benefit'

// 2. props
const props = defineProps<{
  benefit: Benefit
}>()

// 3. emits
const emit = defineEmits<{
  click: [id: string]
}>()

// 4. composables
const { formatCurrency } = useFormat()

// 5. reactive state
const isHovered = ref(false)

// 6. computed
const displayAmount = computed(() => formatCurrency(props.benefit.estimatedAmount))

// 7. methods
function handleClick() {
  emit('click', props.benefit.id)
}
</script>

<style scoped>
/* 컴포넌트 전용 스타일 */
.benefit-card {
  /* ... */
}
</style>
```

### 9.2 Composables 작성

```typescript
// composables/useBenefitSearch.ts
export function useBenefitSearch() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const results = ref<Benefit[]>([])

  async function search(params: SearchParams) {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/v1/benefits/search', {
        params
      })
      results.value = data
    } catch (e) {
      error.value = '검색에 실패했습니다'
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    results: readonly(results),
    search
  }
}
```

---

## 10. 백엔드 규약 (FastAPI + Python)

### 10.1 API 엔드포인트 구조

```python
# app/routes/benefits.py
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.benefit import BenefitSearchRequest, BenefitResponse
from app.services.benefit_service import BenefitService

router = APIRouter(prefix="/api/v1/benefits", tags=["benefits"])

@router.get("/search", response_model=list[BenefitResponse])
async def search_benefits(
    age: int,
    income: int,
    region: str,
    service: BenefitService = Depends()
):
    """
    나이/소득/지역 기반 지원금 검색

    Args:
        age: 나이 (0-150)
        income: 연소득 (원 단위, 0 = 무소득)
        region: 지역 (서울/경기/전국 등)

    Returns:
        매칭된 지원금 리스트
    """
    try:
        results = await service.search(age=age, income=income, region=region)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 10.2 Pydantic 스키마

```python
# app/schemas/benefit.py
from pydantic import BaseModel, Field
from typing import Optional

class BenefitSearchRequest(BaseModel):
    age: int = Field(ge=0, le=150, description="나이")
    income: int = Field(ge=0, description="연소득 (원 단위)")
    region: str = Field(min_length=1, max_length=50, description="지역")

class BenefitResponse(BaseModel):
    id: str
    name: str
    category: str
    description: Optional[str] = None
    estimated_amount: Optional[str] = None
    link: str

    class Config:
        from_attributes = True  # SQLAlchemy 모델 자동 변환
```

---

## Decision Log 참조

| ID | 항목 | 선택 | 이유 |
|----|------|------|------|
| D-26 | 린터 (BE) | Ruff | 빠르고 설정 간단, Black 통합 |
| D-27 | 린터 (FE) | ESLint + Prettier | Vue 공식 권장 |
| D-28 | 테스트 프레임워크 (BE) | pytest | Python 표준, 비동기 지원 |
| D-29 | 테스트 프레임워크 (FE) | Vitest | Vite 통합, 빠른 속도 |
| D-30 | 환경 변수 관리 | .env + .env.example | 표준 방식, 안전함 |
