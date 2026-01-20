import type { BenefitResponse } from './useBenefitSearch'

/**
 * 인기 서비스 목록을 가져오는 composable (SSR 지원)
 * useFetch를 사용하여 서버/클라이언트 이중 요청 방지
 */
export function usePopularBenefits(limit: number = 10) {
  const config = useRuntimeConfig()

  const { data, pending: loading, error: fetchError } = useFetch<{ benefits: BenefitResponse[] }>(
    `${config.public.apiBase}/api/benefits/popular`,
    {
      key: `popular-benefits-${limit}`,
      params: { limit },
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
