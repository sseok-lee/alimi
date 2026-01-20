import type { BenefitResponse } from './useBenefitSearch'

/**
 * 인기 서비스 목록을 가져오는 composable (SSR 지원)
 * useFetch를 사용하여 서버/클라이언트 이중 요청 방지
 */
export function usePopularBenefits(limit: number = 10) {
  const config = useRuntimeConfig()
  // SSR 시 서버 전용 baseURL 사용, CSR 시 public apiBase 사용 (Nginx 프록시)
  const baseURL = import.meta.server
    ? config.apiBaseServer as string
    : (config.public.apiBase || undefined)

  const { data, pending: loading, error: fetchError } = useFetch<{ benefits: BenefitResponse[] }>(
    '/api/benefits/popular',
    {
      key: `popular-benefits-${limit}`,
      params: { limit },
      baseURL,
    }
  )

  const error = computed(() => {
    if (fetchError.value) {
      return '인기 서비스를 불러오는데 실패했습니다.'
    }
    return null
  })

  const benefits = computed(() => data.value?.benefits ?? [])

  return { loading, error, benefits }
}
