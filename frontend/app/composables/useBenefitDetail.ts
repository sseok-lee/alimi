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

/**
 * 서비스 상세 정보를 가져오는 composable (SSR 지원)
 * useFetch를 사용하여 서버/클라이언트 이중 요청 방지
 */
export function useBenefitDetail(id: Ref<string> | string) {
  const config = useRuntimeConfig()
  const idRef = isRef(id) ? id : ref(id)

  const { data, pending: loading, error: fetchError } = useFetch<BenefitDetailResponse>(
    () => `${config.public.apiBase}/api/benefits/${idRef.value}`,
    {
      key: () => `benefit-detail-${idRef.value}`,
      watch: [idRef],
    }
  )

  const error = computed(() => {
    if (fetchError.value) {
      if (fetchError.value.statusCode === 404) {
        return '서비스를 찾을 수 없습니다'
      }
      return '상세 정보를 불러오는데 실패했습니다'
    }
    return null
  })

  const benefit = computed(() => data.value?.benefit ?? null)
  const relatedBenefits = computed(() => data.value?.relatedBenefits ?? [])

  return {
    loading,
    error,
    benefit,
    relatedBenefits,
    data,
  }
}
