/**
 * Mock API 핸들러 - 지원금 검색
 *
 * MSW를 사용하여 /api/benefits/search 엔드포인트를 모킹합니다.
 */

import { http, HttpResponse } from 'msw';
import type {
  BenefitSearchRequest,
  SearchResultResponse,
} from '../../../../contracts/benefits.contract';
import { mockBenefits } from '../data/benefits';

export const benefitHandlers = [
  // GET /api/benefits/search
  http.get('/api/benefits/search', ({ request }) => {
    const url = new URL(request.url);
    const ageParam = url.searchParams.get('age');
    const incomeParam = url.searchParams.get('income');
    const regionParam = url.searchParams.get('region');

    // 검색 파라미터 파싱
    const searchParams: BenefitSearchRequest = {
      age: ageParam ? parseInt(ageParam, 10) : undefined,
      income: incomeParam ? parseInt(incomeParam, 10) : undefined,
      region: regionParam || undefined,
    };

    // Mock 데이터 필터링
    let filteredBenefits = [...mockBenefits];

    // 나이 필터링
    if (searchParams.age !== undefined) {
      filteredBenefits = filteredBenefits.filter((benefit) => {
        if (benefit.minAge !== undefined && searchParams.age! < benefit.minAge) {
          return false;
        }
        if (benefit.maxAge !== undefined && searchParams.age! > benefit.maxAge) {
          return false;
        }
        return true;
      });
    }

    // 소득 필터링
    if (searchParams.income !== undefined) {
      filteredBenefits = filteredBenefits.filter((benefit) => {
        if (benefit.minIncome !== undefined && searchParams.income! < benefit.minIncome) {
          return false;
        }
        if (benefit.maxIncome !== undefined && searchParams.income! > benefit.maxIncome) {
          return false;
        }
        return true;
      });
    }

    // 지역 필터링
    if (searchParams.region) {
      filteredBenefits = filteredBenefits.filter((benefit) => {
        if (!benefit.region) return true; // 지역 정보 없는 경우 포함
        if (benefit.region === '전국') return true; // 전국 지원금은 모든 지역 포함
        return benefit.region === searchParams.region;
      });
    }

    // 응답 생성
    const response: SearchResultResponse = {
      benefits: filteredBenefits,
      total: filteredBenefits.length,
      searchParams,
    };

    // 약간의 네트워크 지연 시뮬레이션 (300ms)
    return HttpResponse.json(response, { status: 200 });
  }),

  // GET /api/benefits/:id
  http.get('/api/benefits/:id', ({ params }) => {
    const { id } = params;
    const benefit = mockBenefits.find((b) => b.id === id);

    if (!benefit) {
      return HttpResponse.json(
        {
          error: 'Not Found',
          message: `지원금을 찾을 수 없습니다: ${id}`,
        },
        { status: 404 }
      );
    }

    return HttpResponse.json(benefit, { status: 200 });
  }),

  // GET /api/benefits/meta/categories
  http.get('/api/benefits/meta/categories', () => {
    const categories = Array.from(new Set(mockBenefits.map((b) => b.category)));
    return HttpResponse.json({ categories }, { status: 200 });
  }),

  // GET /api/benefits/meta/regions
  http.get('/api/benefits/meta/regions', () => {
    const regions = Array.from(
      new Set(mockBenefits.map((b) => b.region).filter((r): r is string => !!r))
    );
    return HttpResponse.json({ regions }, { status: 200 });
  }),

  // GET /api/health
  http.get('/api/health', () => {
    return HttpResponse.json(
      {
        status: 'ok',
        message: 'MSW Mock API is running',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }),
];
