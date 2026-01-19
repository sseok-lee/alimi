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
      lifeUniversity: body.lifeUniversity,
      targetDisabled: body.targetDisabled,
      targetVeteran: body.targetVeteran,
      jobSeeker: body.jobSeeker,
      jobEmployee: body.jobEmployee,
      familySingleParent: body.familySingleParent,
      familyMultiChild: body.familyMultiChild,
      familySinglePerson: body.familySinglePerson,
      familyNoHouse: body.familyNoHouse,
      supportType: body.supportType,
      onlineApplyAvailable: body.onlineApplyAvailable,
      alwaysOpen: body.alwaysOpen,
      sortBy: body.sortBy,
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

    // 대학생/대학원생 필터
    if (searchParams.lifeUniversity === true) {
      filteredBenefits = filteredBenefits.filter((benefit) => {
        return benefit.lifeUniversity === true;
      });
    }

    // 국가보훈대상자 필터
    if (searchParams.targetVeteran === true) {
      filteredBenefits = filteredBenefits.filter((benefit) => {
        return benefit.targetVeteran === true;
      });
    }

    // 구직자/실업자 필터
    if (searchParams.jobSeeker === true) {
      filteredBenefits = filteredBenefits.filter((benefit) => {
        return benefit.jobSeeker === true;
      });
    }

    // 근로자/직장인 필터
    if (searchParams.jobEmployee === true) {
      filteredBenefits = filteredBenefits.filter((benefit) => {
        return benefit.jobEmployee === true;
      });
    }

    // 1인가구 필터
    if (searchParams.familySinglePerson === true) {
      filteredBenefits = filteredBenefits.filter((benefit) => {
        return benefit.familySinglePerson === true;
      });
    }

    // 무주택세대 필터
    if (searchParams.familyNoHouse === true) {
      filteredBenefits = filteredBenefits.filter((benefit) => {
        return benefit.familyNoHouse === true;
      });
    }

    // 지원 유형 필터
    if (searchParams.supportType && searchParams.supportType !== '') {
      filteredBenefits = filteredBenefits.filter((benefit) => {
        return benefit.supportType === searchParams.supportType;
      });
    }

    // 온라인 신청 가능 필터
    if (searchParams.onlineApplyAvailable === true) {
      filteredBenefits = filteredBenefits.filter((benefit) => {
        return benefit.onlineApplyAvailable === true;
      });
    }

    // 상시 신청 필터
    if (searchParams.alwaysOpen === true) {
      filteredBenefits = filteredBenefits.filter((benefit) => {
        return benefit.alwaysOpen === true;
      });
    }

    // 정렬 처리
    if (searchParams.sortBy === 'popular') {
      // 인기순 정렬 (viewCount 내림차순)
      filteredBenefits = [...filteredBenefits].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    } else if (searchParams.sortBy === 'latest') {
      // 최신순 정렬 (id 역순 - 높은 id가 최신)
      filteredBenefits = [...filteredBenefits].sort((a, b) => b.id.localeCompare(a.id));
    }
    // 기본 정렬은 원래 순서 유지

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

    // 같은 카테고리의 관련 서비스 조회 (현재 benefit 제외, viewCount 높은 순 3개)
    const relatedBenefits = mockBenefits
      .filter((b) => b.category === benefit.category && b.id !== id)
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 3)
      .map((b) => ({
        id: b.id,
        name: b.name,
        category: b.category,
        description: b.description,
        link: b.link,
        viewCount: b.viewCount || 0,
        siteViewCount: b.siteViewCount || 0,
      }));

    // 백엔드 API 응답 구조와 동일하게 반환
    return HttpResponse.json(
      {
        benefit: {
          id: benefit.id,
          name: benefit.name,
          category: benefit.category,
          description: benefit.description,
          supportDetails: benefit.estimatedAmount || null,
          targetAudience: benefit.eligibility?.age || null,
          selectionCriteria: benefit.eligibility?.income || null,
          requiredDocuments: null,
          applicationMethod: null,
          applicationDeadline: null,
          organizationName: null,
          contactInfo: null,
          link: benefit.link,
          viewCount: benefit.viewCount || 0,
          siteViewCount: benefit.siteViewCount || 0,
          minAge: benefit.minAge,
          maxAge: benefit.maxAge,
          minIncome: benefit.minIncome,
          maxIncome: benefit.maxIncome,
          region: benefit.region,
          onlineApplyUrl: null,
          relatedLaws: null,
          supportType: benefit.supportType || null,
          applyAgency: null,
          officialConfirmDocs: null,
          identityConfirmDocs: null,
        },
        relatedBenefits,
      },
      { status: 200 }
    );
  }),

  // GET /api/benefits/meta/categories
  http.get('/api/benefits/meta/categories', () => {
    const categories = Array.from(new Set(mockBenefits.map((b) => b.category)));
    return HttpResponse.json({ categories }, { status: 200 });
  }),

  // GET /api/benefits/meta/regions
  http.get('/api/benefits/meta/regions', () => {
    const regionCounts = [
      { region: '전국', count: 8500 },
      { region: '서울', count: 1200 },
      { region: '경기', count: 980 },
      { region: '부산', count: 650 },
      { region: '대구', count: 520 },
      { region: '인천', count: 480 },
      { region: '광주', count: 420 },
      { region: '대전', count: 380 },
      { region: '울산', count: 320 },
      { region: '세종', count: 180 },
      { region: '강원', count: 450 },
      { region: '충북', count: 380 },
      { region: '충남', count: 420 },
      { region: '전북', count: 390 },
      { region: '전남', count: 410 },
      { region: '경북', count: 480 },
      { region: '경남', count: 520 },
      { region: '제주', count: 280 },
    ]
    return HttpResponse.json({ regions: regionCounts }, { status: 200 })
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
