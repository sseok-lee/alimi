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
  description?: string | null
  // serviceList 필드
  targetAudience?: string | null
  selectionCriteria?: string | null
  supportDetails?: string | null
  applicationMethod?: string | null
  applicationDeadline?: string | null
  organizationName?: string | null
  contactInfo?: string | null
  link: string
  supportType?: string | null
  viewCount?: number | null
  // 레거시 필드 (하위 호환성)
  estimatedAmount?: string | null
  eligibility?: string[] | null
}

export interface SearchResponse {
  benefits: BenefitResponse[]
  total: number
  searchParams: BenefitSearchRequest
}

export function useBenefitSearch() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const results = ref<BenefitResponse[]>([])
  const total = ref(0)

  const search = async (params: BenefitSearchRequest): Promise<BenefitResponse[]> => {
    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()

      // POST 방식으로 변경 (백엔드 API 스펙에 맞춤)
      const response = await fetch(`${config.public.apiBase}/api/benefits/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || '검색에 실패했습니다')
      }

      const data: SearchResponse = await response.json()
      results.value = data.benefits
      total.value = data.total
      return data.benefits
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
    total,
    search,
  }
}
