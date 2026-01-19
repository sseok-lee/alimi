import { ref } from 'vue'
import type { BenefitResponse } from './useBenefitSearch'

export function usePopularBenefits() {
  const config = useRuntimeConfig()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const benefits = ref<BenefitResponse[]>([])

  async function fetchPopular(limit: number = 10) {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ benefits: BenefitResponse[] }>(
        `${config.public.apiBase}/api/benefits/popular`,
        { params: { limit } }
      )
      benefits.value = response.benefits
    } catch (e) {
      error.value = '인기 지원금을 불러오는데 실패했습니다.'
      console.error('Failed to fetch popular benefits:', e)
    } finally {
      loading.value = false
    }
  }

  return { loading, error, benefits, fetchPopular }
}
