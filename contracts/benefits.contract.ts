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
