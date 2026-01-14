import axios, { AxiosInstance } from 'axios';
import type { Benefit } from '@prisma/client';

/**
 * 공공 API 클라이언트
 * - 외부 지원금 API 호출
 * - 응답 정규화 (외부 형식 → Prisma Benefit 스키마)
 * - 에러 처리 및 재시도 로직
 */

// 외부 API 응답 타입 정의
interface ExternalBenefitItem {
  id?: string;
  title?: string;
  name?: string;
  type?: string;
  category?: string;
  description?: string | null;
  estimated_amount?: string | null;
  amount?: string | null;
  eligibility?: string[] | null;
  url?: string;
  link?: string;
  min_age?: number | null;
  max_age?: number | null;
  min_income?: number | null;
  max_income?: number | null;
  region?: string | null;
}

// Axios 클라이언트 설정
function createApiClient(): AxiosInstance {
  const baseURL = process.env.PUBLIC_API_BASE_URL || 'https://mock-api.example.com';
  const timeout = parseInt(process.env.API_TIMEOUT || '10000', 10);

  return axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 공공 API에서 지원금 정보 가져오기
 * @returns Prisma Benefit 스키마 형식의 지원금 배열
 * @throws API 호출 실패 시 에러
 */
export async function fetchBenefits(): Promise<Benefit[]> {
  // MVP: Mock 데이터 사용
  if (process.env.USE_MOCK_API === 'true') {
    return getMockBenefits();
  }

  // 실제 API 호출 (재시도 로직 포함)
  const maxRetries = parseInt(process.env.API_MAX_RETRIES || '3', 10);
  const client = createApiClient();

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await client.get('/benefits');

      // 응답 유효성 검증
      const data = response.data;

      // Null/undefined 체크
      if (!data) {
        throw new Error('Invalid API response format');
      }

      // 세 가지 형식 지원:
      // 1. { data: { items: [...] } } - 중첩된 구조
      // 2. { items: [...] } - 단일 레벨 구조
      // 3. [...] - 직접 배열
      let items: ExternalBenefitItem[];

      if (data.data && Array.isArray(data.data.items)) {
        // 중첩된 구조
        items = data.data.items;
      } else if (Array.isArray(data.items)) {
        // 단일 레벨 구조
        items = data.items;
      } else if (Array.isArray(data)) {
        // 직접 배열
        items = data;
      } else {
        throw new Error('Invalid API response format');
      }

      // 정규화하여 반환
      return normalizeBenefits(items);
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      const shouldRetry = isRetryableError(error);

      if (isLastAttempt || !shouldRetry) {
        throw error;
      }

      // 재시도 전 대기 (exponential backoff)
      await sleep(1000 * attempt);
    }
  }

  throw new Error('Max retries reached');
}

/**
 * 재시도 가능한 에러인지 확인
 */
function isRetryableError(error: unknown): boolean {
  // axios.isAxiosError() 대신 구조 확인 (mock 에러 포함)
  const err = error as { response?: { status?: number }; code?: string };

  // 5xx 서버 에러는 재시도
  if (err.response && err.response.status >= 500 && err.response.status < 600) {
    return true;
  }

  // 타임아웃은 재시도
  if (err.code === 'ECONNABORTED') {
    return true;
  }

  // 네트워크 에러는 재시도 (response가 없는 경우)
  if (err.code && !err.response) {
    return true;
  }

  return false;
}

/**
 * 외부 API 응답을 Prisma Benefit 스키마로 정규화
 */
function normalizeBenefits(items: ExternalBenefitItem[]): Benefit[] {
  const now = new Date();

  return items.map((item) => {
    // ID 생성 (외부 ID가 없으면 랜덤 생성)
    const id = item.id || crypto.randomUUID();

    // 이름 (title 또는 name 필드 사용)
    const name = item.title || item.name || '제목 없음';

    // 카테고리 (type 또는 category 필드 사용)
    const category = item.type || item.category || '기타';

    // 링크 (url 또는 link 필드 사용)
    const link = item.url || item.link || '';

    // 예상 금액 (estimated_amount 또는 amount 필드 사용)
    const estimatedAmount = item.estimated_amount || item.amount || null;

    return {
      id,
      name,
      category,
      description: item.description || null,
      estimatedAmount,
      eligibility: (item.eligibility || null) as unknown as Benefit['eligibility'],
      link,
      minAge: item.min_age ?? null,
      maxAge: item.max_age ?? null,
      minIncome: item.min_income ?? null,
      maxIncome: item.max_income ?? null,
      region: item.region || null,
      source: 'public-api',
      fetchedAt: now,
      createdAt: now,
      updatedAt: now,
    } as Benefit;
  });
}

/**
 * Mock 데이터 반환 (MVP용)
 */
function getMockBenefits(): Benefit[] {
  const now = new Date();

  return [
    {
      id: 'benefit-001',
      name: '청년도약계좌',
      category: '금융지원',
      description: '청년의 자산 형성을 지원하는 적금 상품',
      estimatedAmount: '5년 후 5,000만원',
      eligibility: ['19~34세', '연소득 7,500만원 이하'] as unknown as Benefit['eligibility'],
      link: 'https://www.kinfa.or.kr/',
      minAge: 19,
      maxAge: 34,
      minIncome: null,
      maxIncome: 75000000,
      region: '전국',
      source: 'mock',
      fetchedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'benefit-002',
      name: '청년내일채움공제',
      category: '취업지원',
      description: '중소기업 재직 청년의 자산형성 및 장기근속 지원',
      estimatedAmount: '2년 후 1,200만원',
      eligibility: ['15~34세', '중소기업 재직자'] as unknown as Benefit['eligibility'],
      link: 'https://www.sbiz.or.kr/',
      minAge: 15,
      maxAge: 34,
      minIncome: null,
      maxIncome: null,
      region: '전국',
      source: 'mock',
      fetchedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'benefit-003',
      name: '청년월세 한시 특별지원',
      category: '주거지원',
      description: '저소득 청년의 월세 부담 완화',
      estimatedAmount: '월 20만원, 최대 12개월',
      eligibility: ['19~34세', '무주택 세대구성원', '소득 중위 60% 이하'] as unknown as Benefit['eligibility'],
      link: 'https://www.myhome.go.kr/',
      minAge: 19,
      maxAge: 34,
      minIncome: null,
      maxIncome: 60000000,
      region: '전국',
      source: 'mock',
      fetchedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  ] as Benefit[];
}

/**
 * 지연 헬퍼 함수
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
