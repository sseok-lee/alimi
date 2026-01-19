import type { BenefitSearchRequest } from './useBenefitSearch'

export function useShareUrl() {
  const route = useRoute()
  const router = useRouter()

  // 검색 파라미터 → URL 쿼리 인코딩
  function encodeSearchParams(params: BenefitSearchRequest): Record<string, string> {
    const query: Record<string, string> = {}

    // 필수 파라미터
    if (params.age) query.age = String(params.age)
    if (params.income !== undefined) query.income = String(params.income)
    if (params.region) query.region = params.region

    // 선택 파라미터
    if (params.category) query.category = params.category
    if (params.supportType) query.supportType = params.supportType

    // Boolean 필터 (true인 경우만 포함)
    if (params.lifePregnancy) query.lifePregnancy = '1'
    if (params.lifeUniversity) query.lifeUniversity = '1'
    if (params.targetDisabled) query.targetDisabled = '1'
    if (params.targetVeteran) query.targetVeteran = '1'
    if (params.jobSeeker) query.jobSeeker = '1'
    if (params.jobEmployee) query.jobEmployee = '1'
    if (params.familySingleParent) query.familySingleParent = '1'
    if (params.familyMultiChild) query.familyMultiChild = '1'
    if (params.familySinglePerson) query.familySinglePerson = '1'
    if (params.familyNoHouse) query.familyNoHouse = '1'
    if (params.onlineApplyAvailable) query.onlineApplyAvailable = '1'
    if (params.alwaysOpen) query.alwaysOpen = '1'

    return query
  }

  // URL 쿼리 → 검색 파라미터 디코딩
  function decodeSearchParams(): BenefitSearchRequest | null {
    const query = route.query

    if (!query.age || !query.region) return null

    return {
      age: Number(query.age),
      income: query.income ? Number(query.income) : 0,
      region: String(query.region),
      category: query.category ? String(query.category) : undefined,
      supportType: query.supportType ? String(query.supportType) : undefined,
      lifePregnancy: query.lifePregnancy === '1',
      lifeUniversity: query.lifeUniversity === '1',
      targetDisabled: query.targetDisabled === '1',
      targetVeteran: query.targetVeteran === '1',
      jobSeeker: query.jobSeeker === '1',
      jobEmployee: query.jobEmployee === '1',
      familySingleParent: query.familySingleParent === '1',
      familyMultiChild: query.familyMultiChild === '1',
      familySinglePerson: query.familySinglePerson === '1',
      familyNoHouse: query.familyNoHouse === '1',
      onlineApplyAvailable: query.onlineApplyAvailable === '1',
      alwaysOpen: query.alwaysOpen === '1',
    }
  }

  // URL 업데이트 (네비게이션 없이)
  function updateUrl(params: BenefitSearchRequest) {
    const query = encodeSearchParams(params)
    router.replace({ query })
  }

  // 공유용 전체 URL 생성
  function getShareUrl(params: BenefitSearchRequest): string {
    const query = encodeSearchParams(params)
    const queryString = new URLSearchParams(query).toString()
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    return `${baseUrl}/?${queryString}`
  }

  // URL에 검색 파라미터가 있는지 확인
  function hasSearchParams(): boolean {
    return !!route.query.age && !!route.query.region
  }

  return {
    encodeSearchParams,
    decodeSearchParams,
    updateUrl,
    getShareUrl,
    hasSearchParams
  }
}
