import { ref } from 'vue'

export interface BenefitSearchRequest {
  age: number
  income: number
  region: string
  category?: string
  lifePregnancy?: boolean
  lifeUniversity?: boolean
  targetDisabled?: boolean
  targetVeteran?: boolean
  jobSeeker?: boolean
  jobEmployee?: boolean
  familySingleParent?: boolean
  familyMultiChild?: boolean
  familySinglePerson?: boolean
  familyNoHouse?: boolean
  supportType?: string
  onlineApplyAvailable?: boolean
  alwaysOpen?: boolean
  sortBy?: 'latest' | 'popular'
  page?: number
  limit?: number
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

export interface SearchResponse {
  benefits: BenefitResponse[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
}

export function useBenefitSearch() {
  const loading = ref(false)
  const loadingMore = ref(false)
  const error = ref<string | null>(null)
  const results = ref<BenefitResponse[]>([])
  const totalCount = ref(0)
  const currentPage = ref(1)
  const totalPages = ref(0)
  const limit = ref(20)
  const lastSearchParams = ref<BenefitSearchRequest | null>(null)

  const search = async (params: BenefitSearchRequest): Promise<BenefitResponse[]> => {
    loading.value = true
    error.value = null
    currentPage.value = 1
    results.value = []

    try {
      const config = useRuntimeConfig()

      const response = await fetch(`${config.public.apiBase}/api/benefits/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: params.age,
          income: params.income,
          region: params.region,
          category: params.category,
          lifePregnancy: params.lifePregnancy,
          lifeUniversity: params.lifeUniversity,
          targetDisabled: params.targetDisabled,
          targetVeteran: params.targetVeteran,
          jobSeeker: params.jobSeeker,
          jobEmployee: params.jobEmployee,
          familySingleParent: params.familySingleParent,
          familyMultiChild: params.familyMultiChild,
          familySinglePerson: params.familySinglePerson,
          familyNoHouse: params.familyNoHouse,
          supportType: params.supportType,
          onlineApplyAvailable: params.onlineApplyAvailable,
          alwaysOpen: params.alwaysOpen,
          sortBy: params.sortBy,
          page: 1,
          limit: limit.value,
        }),
      })

      if (!response.ok) {
        throw new Error('검색에 실패했습니다')
      }

      const data: SearchResponse = await response.json()
      results.value = data.benefits || []
      totalCount.value = data.totalCount || 0
      currentPage.value = data.page || 1
      totalPages.value = data.totalPages || 0
      lastSearchParams.value = params

      return data.benefits || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다'
      throw err
    } finally {
      loading.value = false
    }
  }

  const loadMore = async (): Promise<BenefitResponse[]> => {
    if (!lastSearchParams.value || currentPage.value >= totalPages.value) {
      return []
    }

    loadingMore.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const nextPage = currentPage.value + 1

      const response = await fetch(`${config.public.apiBase}/api/benefits/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...lastSearchParams.value,
          page: nextPage,
          limit: limit.value,
        }),
      })

      if (!response.ok) {
        throw new Error('추가 로딩에 실패했습니다')
      }

      const data: SearchResponse = await response.json()
      const newBenefits = data.benefits || []
      results.value = [...results.value, ...newBenefits]
      currentPage.value = data.page || nextPage
      totalPages.value = data.totalPages || 0

      return newBenefits
    } catch (err) {
      error.value = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다'
      throw err
    } finally {
      loadingMore.value = false
    }
  }

  const hasMore = () => currentPage.value < totalPages.value

  return {
    loading,
    loadingMore,
    error,
    results,
    totalCount,
    currentPage,
    totalPages,
    search,
    loadMore,
    hasMore,
  }
}
