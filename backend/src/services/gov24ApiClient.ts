import axios, { AxiosInstance } from 'axios';

/**
 * 보조금24 공공데이터 API 클라이언트
 *
 * 행정안전부 대한민국 공공서비스 정보 (보조금24) API를 호출하는 클라이언트입니다.
 *
 * 엔드포인트:
 * - /gov24/v3/serviceList - 서비스 목록 조회
 * - /gov24/v3/supportConditions - 지원조건 조회
 * - /gov24/v3/serviceDetail - 서비스 상세 조회
 *
 * 참고: docs/planning/08-api-integration.md
 */

// ===== 타입 정의 =====

/** serviceList API 응답 아이템 */
export interface ServiceListItem {
  서비스ID: string;
  서비스명: string;
  서비스분야: string;
  서비스목적요약?: string;
  지원대상?: string;
  선정기준?: string;
  지원내용?: string;
  신청방법?: string;
  신청기한?: string;
  상세조회URL: string;
  소관기관명?: string;
  전화문의?: string;
  지원유형?: string;
  사용자구분?: string;
  접수기관명?: string;
  조회수?: number;
  등록일시?: string;
  수정일시?: string;
}

/** supportConditions API 응답 아이템 */
export interface SupportConditionItem {
  서비스ID: string;
  서비스명: string;
  // 성별
  JA0101?: string; // 남성 (Y/N)
  JA0102?: string; // 여성 (Y/N)
  // 연령
  JA0110?: number | null; // 대상연령(시작)
  JA0111?: number | null; // 대상연령(종료)
  // 소득 수준
  JA0201?: string; // 중위소득 0~50%
  JA0202?: string; // 중위소득 51~75%
  JA0203?: string; // 중위소득 76~100%
  JA0204?: string; // 중위소득 101~200%
  JA0205?: string; // 중위소득 200% 초과
  // 생애주기
  JA0301?: string; // 예비부모/난임
  JA0302?: string; // 임산부
  JA0303?: string; // 출산/입양
  // 학생
  JA0317?: string; // 초등학생
  JA0318?: string; // 중학생
  JA0319?: string; // 고등학생
  JA0320?: string; // 대학생/대학원생
  // 직업
  JA0313?: string; // 농업인
  JA0314?: string; // 어업인
  JA0315?: string; // 축산업인
  JA0316?: string; // 임업인
  JA0326?: string; // 근로자/직장인
  JA0327?: string; // 구직자/실업자
  // 특수 상황
  JA0328?: string; // 장애인
  JA0329?: string; // 국가보훈대상자
  JA0330?: string; // 질병/질환자
  // 가족 상황
  JA0401?: string; // 다문화가족
  JA0402?: string; // 북한이탈주민
  JA0403?: string; // 한부모/조손가정
  JA0404?: string; // 1인가구
  JA0411?: string; // 다자녀가구
  JA0412?: string; // 무주택세대
  JA0413?: string; // 신규전입
  // 기타
  JA0322?: string; // 해당사항없음
}

/** serviceDetail API 응답 아이템 */
export interface ServiceDetailItem {
  서비스ID: string;
  서비스명: string;
  서비스목적?: string;
  구비서류?: string;
  공무원확인구비서류?: string;
  본인확인필요구비서류?: string;
  온라인신청사이트URL?: string;
  법령?: string;
  자치법규?: string;
  접수기관명?: string;
  문의처?: string;
}

/** API 응답 공통 형식 */
export interface ApiResponse<T> {
  page: number;
  perPage: number;
  totalCount: number;
  currentCount: number;
  matchCount: number;
  data: T[];
}

// ===== 설정 =====

const LOG_ENABLED = process.env.LOG_LEVEL !== 'silent';
const API_TIMEOUT = 30000; // 30초 (데이터가 많아 타임아웃 여유있게 설정)
const RATE_LIMIT_DELAY = 1000; // 1초 대기 (Rate Limiting)

/** Axios 클라이언트 생성 */
function createGov24Client(): AxiosInstance {
  const baseURL = process.env.OPENAPI_BASE_URL || 'https://api.odcloud.kr/api';
  const serviceKey = process.env.OPENAPI_SERVICE_KEY;

  if (!serviceKey) {
    throw new Error('OPENAPI_SERVICE_KEY 환경변수가 설정되지 않았습니다.');
  }

  return axios.create({
    baseURL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      serviceKey,
    },
  });
}

// ===== API 함수 =====

/**
 * 서비스 목록 조회 (serviceList)
 *
 * @param page 페이지 번호 (기본값: 1)
 * @param perPage 페이지당 항목 수 (기본값: 100, 최대: 1000)
 * @returns 서비스 목록 응답
 */
export async function fetchServiceList(
  page: number = 1,
  perPage: number = 100
): Promise<ApiResponse<ServiceListItem>> {
  const client = createGov24Client();

  if (LOG_ENABLED) {
    console.log(`[Gov24API] Fetching serviceList (page: ${page}, perPage: ${perPage})`);
  }

  try {
    const response = await client.get<ApiResponse<ServiceListItem>>('/gov24/v3/serviceList', {
      params: {
        page,
        perPage,
        returnType: 'JSON',
      },
    });

    if (LOG_ENABLED) {
      console.log(
        `[Gov24API] serviceList fetched: ${response.data.currentCount}/${response.data.totalCount} items`
      );
    }

    return response.data;
  } catch (error) {
    handleApiError(error, 'serviceList');
    throw error;
  }
}

/**
 * 지원조건 조회 (supportConditions)
 *
 * @param page 페이지 번호 (기본값: 1)
 * @param perPage 페이지당 항목 수 (기본값: 100, 최대: 1000)
 * @returns 지원조건 응답
 */
export async function fetchSupportConditions(
  page: number = 1,
  perPage: number = 100
): Promise<ApiResponse<SupportConditionItem>> {
  const client = createGov24Client();

  if (LOG_ENABLED) {
    console.log(`[Gov24API] Fetching supportConditions (page: ${page}, perPage: ${perPage})`);
  }

  try {
    const response = await client.get<ApiResponse<SupportConditionItem>>(
      '/gov24/v3/supportConditions',
      {
        params: {
          page,
          perPage,
          returnType: 'JSON',
        },
      }
    );

    if (LOG_ENABLED) {
      console.log(
        `[Gov24API] supportConditions fetched: ${response.data.currentCount}/${response.data.totalCount} items`
      );
    }

    return response.data;
  } catch (error) {
    handleApiError(error, 'supportConditions');
    throw error;
  }
}

/**
 * 서비스 상세 조회 (serviceDetail)
 *
 * @param serviceId 서비스 ID
 * @returns 서비스 상세 정보
 */
export async function fetchServiceDetail(serviceId: string): Promise<ServiceDetailItem | null> {
  const client = createGov24Client();

  if (LOG_ENABLED) {
    console.log(`[Gov24API] Fetching serviceDetail for ${serviceId}`);
  }

  try {
    const response = await client.get<ApiResponse<ServiceDetailItem>>('/gov24/v3/serviceDetail', {
      params: {
        'cond[서비스ID::EQ]': serviceId,
        returnType: 'JSON',
      },
    });

    if (response.data.data.length === 0) {
      if (LOG_ENABLED) {
        console.log(`[Gov24API] serviceDetail not found for ${serviceId}`);
      }
      return null;
    }

    if (LOG_ENABLED) {
      console.log(`[Gov24API] serviceDetail fetched for ${serviceId}`);
    }

    return response.data.data[0];
  } catch (error) {
    handleApiError(error, 'serviceDetail');
    throw error;
  }
}

/**
 * 전체 서비스 목록 페이징 조회
 *
 * 모든 페이지를 순회하며 전체 서비스 목록을 가져옵니다.
 * Rate Limiting을 위해 각 요청 사이에 1초 대기합니다.
 *
 * @param perPage 페이지당 항목 수 (기본값: 1000)
 * @param onProgress 진행률 콜백 (page, totalPages)
 * @returns 전체 서비스 목록
 */
export async function fetchAllServiceList(
  perPage: number = 1000,
  onProgress?: (page: number, totalPages: number) => void
): Promise<ServiceListItem[]> {
  const allItems: ServiceListItem[] = [];

  // 첫 페이지 조회로 totalCount 확인
  const firstResponse = await fetchServiceList(1, perPage);
  allItems.push(...firstResponse.data);

  const totalCount = firstResponse.totalCount;
  const totalPages = Math.ceil(totalCount / perPage);

  if (LOG_ENABLED) {
    console.log(`[Gov24API] Total services: ${totalCount}, Pages: ${totalPages}`);
  }

  if (onProgress) {
    onProgress(1, totalPages);
  }

  // 나머지 페이지 조회
  for (let page = 2; page <= totalPages; page++) {
    await sleep(RATE_LIMIT_DELAY); // Rate Limiting

    const response = await fetchServiceList(page, perPage);
    allItems.push(...response.data);

    if (onProgress) {
      onProgress(page, totalPages);
    }
  }

  if (LOG_ENABLED) {
    console.log(`[Gov24API] All serviceList fetched: ${allItems.length} items`);
  }

  return allItems;
}

/**
 * 전체 지원조건 페이징 조회
 *
 * 모든 페이지를 순회하며 전체 지원조건을 가져옵니다.
 * Rate Limiting을 위해 각 요청 사이에 1초 대기합니다.
 *
 * @param perPage 페이지당 항목 수 (기본값: 1000)
 * @param onProgress 진행률 콜백 (page, totalPages)
 * @returns 전체 지원조건 목록
 */
export async function fetchAllSupportConditions(
  perPage: number = 1000,
  onProgress?: (page: number, totalPages: number) => void
): Promise<SupportConditionItem[]> {
  const allItems: SupportConditionItem[] = [];

  // 첫 페이지 조회로 totalCount 확인
  const firstResponse = await fetchSupportConditions(1, perPage);
  allItems.push(...firstResponse.data);

  const totalCount = firstResponse.totalCount;
  const totalPages = Math.ceil(totalCount / perPage);

  if (LOG_ENABLED) {
    console.log(`[Gov24API] Total supportConditions: ${totalCount}, Pages: ${totalPages}`);
  }

  if (onProgress) {
    onProgress(1, totalPages);
  }

  // 나머지 페이지 조회
  for (let page = 2; page <= totalPages; page++) {
    await sleep(RATE_LIMIT_DELAY); // Rate Limiting

    const response = await fetchSupportConditions(page, perPage);
    allItems.push(...response.data);

    if (onProgress) {
      onProgress(page, totalPages);
    }
  }

  if (LOG_ENABLED) {
    console.log(`[Gov24API] All supportConditions fetched: ${allItems.length} items`);
  }

  return allItems;
}

// ===== 헬퍼 함수 =====

/** API 에러 핸들링 */
function handleApiError(error: unknown, endpoint: string): void {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      console.error(`[Gov24API] ${endpoint}: 인증 실패 (401) - API 키를 확인하세요.`);
    } else if (status === 429) {
      console.error(`[Gov24API] ${endpoint}: API 호출 제한 초과 (429) - 잠시 후 다시 시도하세요.`);
    } else if (status === 500) {
      console.error(`[Gov24API] ${endpoint}: 서버 오류 (500) - ${message}`);
    } else if (error.code === 'ECONNABORTED') {
      console.error(`[Gov24API] ${endpoint}: 타임아웃 - 서버 응답이 없습니다.`);
    } else {
      console.error(`[Gov24API] ${endpoint}: 오류 (${status}) - ${message}`);
    }
  } else {
    console.error(`[Gov24API] ${endpoint}: 알 수 없는 오류 -`, error);
  }
}

/** 지연 헬퍼 함수 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ===== 매핑 헬퍼 =====

/**
 * JA 코드 값을 Boolean으로 변환
 * "Y" → true, "N" → false, undefined/null → null
 */
export function jaCodeToBoolean(value: string | undefined | null): boolean | null {
  if (value === 'Y') return true;
  if (value === 'N') return false;
  return null;
}
