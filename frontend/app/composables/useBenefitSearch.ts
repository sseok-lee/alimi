import { ref } from 'vue'

export interface BenefitSearchRequest {
  age: number
  income: number
  region: string
}

export interface BenefitResponse {
  id: string
  name: string
  category: string
  description?: string
  estimated_amount?: string
  eligibility: string[]
  link: string
}

export function useBenefitSearch() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const results = ref<BenefitResponse[]>([])

  const search = async (params: BenefitSearchRequest): Promise<BenefitResponse[]> => {
    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const queryParams = new URLSearchParams({
        age: params.age.toString(),
        income: params.income.toString(),
        region: params.region,
      })

      const response = await fetch(
        `${config.public.apiBase}/api/v1/benefits/search?${queryParams}`,
      )

      if (!response.ok) {
        throw new Error('검색에 실패했습니다')
      }

      const data = await response.json()
      results.value = data
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    results,
    search,
  }
}
