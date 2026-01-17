import { ref } from 'vue'

export interface BenefitDetail {
  id: string
  name: string
  category: string
  description: string | null
  supportDetails: string | null
  targetAudience: string | null
  selectionCriteria: string | null
  requiredDocuments: string | null
  applicationMethod: string | null
  applicationDeadline: string | null
  organizationName: string | null
  contactInfo: string | null
  link: string
  viewCount: number
  siteViewCount: number
  minAge: number | null
  maxAge: number | null
  minIncome: number | null
  maxIncome: number | null
  region: string | null
  supportType: string | null
  applyAgency: string | null
  officialConfirmDocs: string | null
  identityConfirmDocs: string | null
  relatedLaws: string | null
}

export interface SimpleBenefit {
  id: string
  name: string
  category: string
  description: string | null
  link: string
  viewCount: number
  siteViewCount: number
}

export interface BenefitDetailResponse {
  benefit: BenefitDetail
  relatedBenefits: SimpleBenefit[]
}

export function useBenefitDetail() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const benefit = ref<BenefitDetail | null>(null)
  const relatedBenefits = ref<SimpleBenefit[]>([])

  const fetchDetail = async (id: string): Promise<BenefitDetailResponse | null> => {
    loading.value = true
    error.value = null
    benefit.value = null
    relatedBenefits.value = []

    try {
      const config = useRuntimeConfig()

      const response = await fetch(`${config.public.apiBase}/api/benefits/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 404) {
        error.value = '지원금을 찾을 수 없습니다'
        return null
      }

      if (!response.ok) {
        throw new Error('상세 정보를 불러오는데 실패했습니다')
      }

      const data: BenefitDetailResponse = await response.json()
      benefit.value = data.benefit
      relatedBenefits.value = data.relatedBenefits

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
    benefit,
    relatedBenefits,
    fetchDetail,
  }
}
