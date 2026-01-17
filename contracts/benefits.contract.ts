/**
 * 지원금 검색 API 계약 (v1)
 *
 * 이 파일은 BE/FE가 공유하는 API 계약을 정의합니다.
 * 변경 시 양쪽에서 동기화가 필요합니다.
 */

// ============================================
// 검색 API: POST /api/benefits/search
// ============================================

/**
 * 지원금 검색 요청
 */
export interface BenefitSearchRequest {
  age?: number;        // 0-150, optional
  income?: number;     // 원 단위, 0 = 무소득, optional
  region?: string;     // 서울/경기/전국 등, optional

  // 카테고리 필터
  category?: string;   // 복지서비스/일자리 등

  // 생애주기 필터 (임신/출산)
  lifePregnancy?: boolean; // 임신/출산 관련 (JA0301, JA0302, JA0303)
  lifeUniversity?: boolean; // 대학생/대학원생

  // 특수 대상 필터
  targetDisabled?: boolean;      // 장애인 (JA0328)
  targetVeteran?: boolean;       // 국가보훈대상자

  // 직업 상황 필터
  jobSeeker?: boolean;           // 구직자/실업자
  jobEmployee?: boolean;         // 근로자/직장인

  // 가족 상황 필터
  familySingleParent?: boolean;  // 한부모/조손 (JA0403)
  familyMultiChild?: boolean;    // 다자녀 (JA0411)
  familySinglePerson?: boolean;  // 1인가구
  familyNoHouse?: boolean;       // 무주택세대

  // 지원 유형 필터
  supportType?: string;          // 현금/현물/서비스/이용권/감면 등

  // 신청 조건 필터
  onlineApplyAvailable?: boolean; // 온라인 신청 가능
  alwaysOpen?: boolean;           // 상시 신청

  // 정렬 옵션
  sortBy?: 'latest' | 'popular';  // 최신순/인기순
}

/**
 * 지원금 응답
 */
export interface BenefitResponse {
  id: string;
  name: string;
  category: string;
  description?: string;
  estimatedAmount?: string;
  eligibility?: Record<string, unknown>;
  link: string;
  minAge?: number;
  maxAge?: number;
  minIncome?: number;
  maxIncome?: number;
  region?: string;
  lifePregnancy?: boolean;
  lifeUniversity?: boolean;
  targetDisabled?: boolean;
  targetVeteran?: boolean;
  jobSeeker?: boolean;
  jobEmployee?: boolean;
  familySingleParent?: boolean;
  familyMultiChild?: boolean;
  familySinglePerson?: boolean;
  familyNoHouse?: boolean;
  supportType?: string;
  onlineApplyAvailable?: boolean;
  alwaysOpen?: boolean;
  viewCount?: number;
  siteViewCount?: number;
}

/**
 * 검색 결과 응답
 */
export interface SearchResultResponse {
  benefits: BenefitResponse[];
  total: number;
  searchParams: BenefitSearchRequest;
}

// ============================================
// 에러 응답
// ============================================

/**
 * 검증 에러 응답 (422)
 */
export interface ValidationErrorResponse {
  error: 'Validation Error';
  details: {
    formErrors: string[];
    fieldErrors: Record<string, string[]>;
  };
}

/**
 * 일반 에러 응답
 */
export interface ErrorResponse {
  error: string;
  message?: string;
}

// ============================================
// API 엔드포인트 정의
// ============================================

export const API_ENDPOINTS = {
  BENEFITS_SEARCH: '/api/benefits/search',
  BENEFITS_DETAIL: '/api/benefits/:id',
  BENEFITS_CATEGORIES: '/api/benefits/meta/categories',
  BENEFITS_REGIONS: '/api/benefits/meta/regions',
  HEALTH: '/api/health',
} as const;
