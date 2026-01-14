# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

복지알리미 - 20~30대 청년층을 위한 맞춤형 정부 지원금 검색 서비스. 나이/소득/지역 3가지 입력으로 지원금을 매칭합니다.

## Tech Stack

- **Backend**: Express + TypeScript + Prisma + Zod + MySQL
- **Frontend**: Vue 3 + Nuxt 3 + TypeScript + TailwindCSS + Pinia
- **Testing**: Vitest + Supertest (BE), Vitest (FE), Playwright (E2E)
- **Infrastructure**: Docker Compose

## Common Commands

### Backend (from `backend/`)
```bash
npm run dev              # 개발 서버 (tsx watch)
npm run test             # 테스트 실행
npm run test:watch       # 테스트 watch 모드
npm run test:coverage    # 커버리지 포함 테스트
npm run lint             # ESLint
npm run db:push          # Prisma 스키마 동기화 (dev)
npm run db:migrate       # Prisma 마이그레이션
npm run db:studio        # Prisma Studio
```

### Frontend (from `frontend/`)
```bash
npm run dev              # 개발 서버 (localhost:3000)
npm run build            # 프로덕션 빌드
npm run generate         # 정적 사이트 생성
```

### Docker
```bash
docker compose up -d     # MySQL 컨테이너 시작
docker compose down      # 컨테이너 중지
```

## Architecture

```
Client (Nuxt SSR/SSG) → Backend (Express API) → MySQL (Prisma ORM)
                                ↓
                        External APIs (보조금24, 지자체 API)
```

### Backend Structure
- `src/routes/` - Express 라우터 (API 엔드포인트)
- `src/services/` - 비즈니스 로직
- `src/schemas/` - Zod 검증 스키마
- `src/middlewares/` - Express 미들웨어
- `prisma/schema.prisma` - DB 스키마

### Frontend Structure
- `pages/` - Nuxt 페이지 (SSR/SSG)
- `components/` - Vue 컴포넌트
- `composables/` - Composition API 훅
- `stores/` - Pinia 상태 관리

## Key Patterns

### API 검증
모든 API 입력은 Zod 스키마로 검증:
```typescript
const result = Schema.safeParse(req.body)
if (!result.success) return res.status(422).json({ error: result.error.flatten() })
```

### Prisma 사용
```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

### Vue Composables
```typescript
export function useFeature() {
  const loading = ref(false)
  const data = ref<Type | null>(null)
  // ...
  return { loading: readonly(loading), data: readonly(data), fetch }
}
```

## Agent Team

이 프로젝트는 `.claude/agents/`에 정의된 전문가 에이전트를 사용합니다:
- `backend-specialist` - Express API, Prisma
- `frontend-specialist` - Vue/Nuxt UI
- `database-specialist` - Prisma 스키마, 마이그레이션
- `test-specialist` - Vitest, Supertest

오케스트레이터 커맨드: `/orchestrate`

## Planning Documents

`docs/planning/`에 기획 문서가 있습니다:
- `02-trd.md` - 기술 요구사항 (스택 선택 이유)
- `06-tasks.md` - 개발 태스크 목록
- `07-coding-convention.md` - 코딩 컨벤션

## Environment Variables

```bash
# backend/.env
DATABASE_URL=mysql://alimi:password@localhost:3306/alimi
PORT=8000
CORS_ORIGIN=http://localhost:3000
```
