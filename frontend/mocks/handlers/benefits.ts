/**
 * Mock API 핸들러 - 지원금 검색
 *
 * MSW를 사용하여 /api/benefits/search 엔드포인트를 모킹합니다.
 */

import { http, HttpResponse } from 'msw';
import type {
  BenefitSearchRequest,
} from '../../../../contracts/benefits.contract';
import { mockBenefits } from '../data/benefits';

export const benefitHandlers = [
  // POST /api/benefits/search
  http.post('/api/benefits/search', async ({ request }) => {
    const body = await request.json() as BenefitSearchRequest & { page?: number; limit?: number };

    // 검색 파라미터
    const searchParams: BenefitSearchRequest = {
      age: body.age,
      income: body.income,
      region: body.region,
      category: body.category,
      lifePregnancy: body.lifePregnancy,
      targetDisabled: body.targetDisabled,
      familySingleParent: body.familySingleParent,
      familyMultiChild: body.familyMultiChild,
    };

    const page = body.page || 1;
    const limit = body.limit || 20;

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

    // 카테고리 필터링
    if (searchParams.category && searchParams.category !== '') {
      filteredBenefits = filteredBenefits.filter((benefit) => {
        return benefit.category === searchParams.category;
      });
    }

    // 생애주기 필터 (임신/출산)
    if (searchParams.lifePregnancy === true) {
      filteredBenefits = filteredBenefits.filter((benefit) => {
        return benefit.lifePregnancy === true;
      });
    }

    // 장애인 필터
    if (searchParams.targetDisabled === true) {
      filteredBenefits = filteredBenefits.filter((benefit) => {
        return benefit.targetDisabled === true;
      });
    }

    // 한부모/조손 필터
    if (searchParams.familySingleParent === true) {
      filteredBenefits = filteredBenefits.filter((benefit) => {
        return benefit.familySingleParent === true;
      });
    }

    // 다자녀 필터
    if (searchParams.familyMultiChild === true) {
      filteredBenefits = filteredBenefits.filter((benefit) => {
        return benefit.familyMultiChild === true;
      });
    }

    // 페이징 적용
    const totalCount = filteredBenefits.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const pagedBenefits = filteredBenefits.slice(startIndex, startIndex + limit);

    // 응답 생성
    const response = {
      benefits: pagedBenefits,
      totalCount,
      page,
      limit,
      totalPages,
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
