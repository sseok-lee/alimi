/**
 * 지역 코드 상수 및 유틸리티
 * - 17개 시/도 코드 정의
 * - organizationName에서 지역 추출 함수
 */

export const REGION_CODES = {
  SEOUL: '서울',
  BUSAN: '부산',
  DAEGU: '대구',
  INCHEON: '인천',
  GWANGJU: '광주',
  DAEJEON: '대전',
  ULSAN: '울산',
  SEJONG: '세종',
  GYEONGGI: '경기',
  GANGWON: '강원',
  CHUNGBUK: '충북',
  CHUNGNAM: '충남',
  JEONBUK: '전북',
  JEONNAM: '전남',
  GYEONGBUK: '경북',
  GYEONGNAM: '경남',
  JEJU: '제주',
  NATIONWIDE: '전국'
} as const;

export type RegionCode = typeof REGION_CODES[keyof typeof REGION_CODES];

/**
 * 지역 패턴 매칭 테이블
 * - 정규식 패턴과 지역 코드 매핑
 * - 순서가 중요: 더 구체적인 패턴을 먼저 배치
 */
export const REGION_PATTERNS: { pattern: RegExp; region: RegionCode }[] = [
  { pattern: /서울(특별시)?/, region: REGION_CODES.SEOUL },
  { pattern: /부산(광역시)?/, region: REGION_CODES.BUSAN },
  { pattern: /대구(광역시)?/, region: REGION_CODES.DAEGU },
  { pattern: /인천(광역시)?/, region: REGION_CODES.INCHEON },
  { pattern: /광주(광역시)?/, region: REGION_CODES.GWANGJU },
  { pattern: /대전(광역시)?/, region: REGION_CODES.DAEJEON },
  { pattern: /울산(광역시)?/, region: REGION_CODES.ULSAN },
  { pattern: /세종(특별자치시)?/, region: REGION_CODES.SEJONG },
  { pattern: /경기(도)?/, region: REGION_CODES.GYEONGGI },
  { pattern: /강원(특별자치도|도)?/, region: REGION_CODES.GANGWON },
  { pattern: /충청북도|충북/, region: REGION_CODES.CHUNGBUK },
  { pattern: /충청남도|충남/, region: REGION_CODES.CHUNGNAM },
  { pattern: /전라북도|전북|전북특별자치도/, region: REGION_CODES.JEONBUK },
  { pattern: /전라남도|전남/, region: REGION_CODES.JEONNAM },
  { pattern: /경상북도|경북/, region: REGION_CODES.GYEONGBUK },
  { pattern: /경상남도|경남/, region: REGION_CODES.GYEONGNAM },
  { pattern: /제주(특별자치도)?/, region: REGION_CODES.JEJU },
];

/**
 * 기관명(organizationName)에서 지역 코드 추출
 *
 * @param organizationName - 소관기관명 (예: "서울특별시 동대문구", "경기도 수원시", "보건복지부")
 * @returns 17개 시/도 코드 중 하나, 매칭 실패 시 '전국'
 *
 * @example
 * extractRegionFromOrganization('서울특별시 동대문구') // '서울'
 * extractRegionFromOrganization('경기도 수원시') // '경기'
 * extractRegionFromOrganization('보건복지부') // '전국'
 * extractRegionFromOrganization(null) // '전국'
 */
export function extractRegionFromOrganization(organizationName: string | null | undefined): RegionCode {
  if (!organizationName) return REGION_CODES.NATIONWIDE;

  for (const { pattern, region } of REGION_PATTERNS) {
    if (pattern.test(organizationName)) {
      return region;
    }
  }

  return REGION_CODES.NATIONWIDE;
}
