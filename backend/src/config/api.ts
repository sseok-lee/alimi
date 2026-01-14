/**
 * 공공 API 설정
 * 환경변수에서 읽어온 설정값들을 중앙 관리
 * 함수로 제공하여 테스트 시 환경변수 변경 가능
 */

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  maxRetries: number;
  useMock: boolean;
  retryDelayBase: number;
}

export function getApiConfig(): ApiConfig {
  return {
    /**
     * 공공 API 기본 URL
     * @default 'https://mock-api.example.com'
     */
    baseURL: process.env.PUBLIC_API_BASE_URL || 'https://mock-api.example.com',

    /**
     * API 요청 타임아웃 (밀리초)
     * @default 10000 (10초)
     */
    timeout: parseInt(process.env.API_TIMEOUT || '10000', 10),

    /**
     * 실패 시 최대 재시도 횟수
     * @default 3
     */
    maxRetries: parseInt(process.env.API_MAX_RETRIES || '3', 10),

    /**
     * Mock API 사용 여부 (개발/테스트용)
     * @default true
     */
    useMock: process.env.USE_MOCK_API !== 'false',

    /**
     * 재시도 간 대기 시간 배수 (exponential backoff)
     * @default 1000 (1초)
     */
    retryDelayBase: parseInt(process.env.API_RETRY_DELAY_BASE || '1000', 10),
  };
}

// 하위 호환성을 위한 기본 export
export const apiConfig = getApiConfig();

/**
 * 설정 검증 함수
 * 서버 시작 시 호출하여 필수 설정값 확인
 */
export function validateApiConfig(): void {
  const config = getApiConfig();

  if (config.timeout < 1000) {
    console.warn('[API Config] Timeout is less than 1 second. This may cause frequent failures.');
  }

  if (config.maxRetries > 5) {
    console.warn(
      '[API Config] Max retries is greater than 5. This may cause slow responses on failures.'
    );
  }

  if (!config.useMock && config.baseURL === 'https://mock-api.example.com') {
    console.warn(
      '[API Config] Mock mode is disabled but baseURL is still using mock URL. Please set PUBLIC_API_BASE_URL.'
    );
  }
}
