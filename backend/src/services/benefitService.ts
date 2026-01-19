import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { BenefitSearchInput, BenefitResponse, BenefitDetailResponse, BenefitDetail, SimpleBenefit } from '../schemas/benefit.js'
import { fetchServiceDetail } from './gov24ApiClient.js'

export interface SearchResult {
  benefits: BenefitResponse[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
}

export async function searchBenefits(params: BenefitSearchInput): Promise<SearchResult> {
  const {
    age,
    income,
    region,
    category,
    lifePregnancy,
    targetDisabled,
    familySingleParent,
    familyMultiChild,
    // Phase 8 추가 필터
    jobSeeker,
    lifeUniversity,
    familySinglePerson,
    familyNoHouse,
    jobEmployee,
    targetVeteran,
    supportType,
    onlineApplyAvailable,
    alwaysOpen,
    sortBy = 'latest',
    page = 1,
    limit = 20
  } = params

  const where: Prisma.BenefitWhereInput = {}

  // 나이 조건
  if (age !== undefined) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      {
        OR: [
          { minAge: null },
          { minAge: { lte: age } }
        ]
      },
      {
        OR: [
          { maxAge: null },
          { maxAge: { gte: age } }
        ]
      }
    ]
  }

  // 소득 조건
  if (income !== undefined) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      {
        OR: [
          { minIncome: null },
          { minIncome: { lte: income } }
        ]
      },
      {
        OR: [
          { maxIncome: null },
          { maxIncome: { gte: income } }
        ]
      }
    ]
  }

  // 지역 조건
  if (region) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      {
        OR: [
          { region: null },
          { region: region },
          { region: '전국' }
        ]
      }
    ]
  }

  // 카테고리 필터
  if (category) {
    where.category = category
  }

  // 생애주기 필터 (임신/출산)
  if (lifePregnancy === true) {
    where.OR = [
      { lifePregnant: true },
      { lifeBirth: true }
    ]
  }

  // 가구특성 필터 (장애인)
  if (targetDisabled === true) {
    where.targetDisabled = true
  }

  // 가구특성 필터 (한부모/조손)
  if (familySingleParent === true) {
    where.familySingleParent = true
  }

  // 가구특성 필터 (다자녀)
  if (familyMultiChild === true) {
    where.familyMultiChild = true
  }

  // Phase 8 추가 필터 - Boolean 필터
  if (jobSeeker === true) {
    where.jobSeeker = true
  }

  if (lifeUniversity === true) {
    where.lifeUniversity = true
  }

  if (familySinglePerson === true) {
    where.familySinglePerson = true
  }

  if (familyNoHouse === true) {
    where.familyNoHouse = true
  }

  if (jobEmployee === true) {
    where.jobEmployee = true
  }

  if (targetVeteran === true) {
    where.targetVeteran = true
  }

  // 지원유형 필터
  if (supportType) {
    where.supportType = supportType
  }

  // 온라인 신청 가능 필터
  if (onlineApplyAvailable === true) {
    where.onlineApplyUrl = { not: null }
  }

  // 상시 신청 가능 필터
  if (alwaysOpen === true) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      {
        OR: [
          { applicationDeadline: { contains: '상시' } },
          { applicationDeadline: { contains: '수시' } },
          { applicationDeadline: null }
        ]
      }
    ]
  }

  const skip = (page - 1) * limit
  const take = limit

  // 정렬 조건 설정
  const orderBy = sortBy === 'popular'
    ? { viewCount: 'desc' as const }
    : { fetchedAt: 'desc' as const }

  // 병렬로 데이터와 총 개수 조회
  const [benefits, totalCount] = await Promise.all([
    prisma.benefit.findMany({
      where,
      skip,
      take,
      orderBy
    }),
    prisma.benefit.count({ where })
  ])

  const mappedBenefits = benefits.map(benefit => ({
    id: benefit.id,
    name: benefit.name,
    category: benefit.category,
    description: benefit.description,
    estimatedAmount: benefit.estimatedAmount,
    eligibility: benefit.eligibility,
    link: benefit.link,
    minAge: benefit.minAge,
    maxAge: benefit.maxAge,
    minIncome: benefit.minIncome,
    maxIncome: benefit.maxIncome,
    region: benefit.region
  }))

  return {
    benefits: mappedBenefits,
    totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit)
  }
}

export async function getBenefitById(id: string): Promise<BenefitResponse | null> {
  const benefit = await prisma.benefit.findUnique({
    where: { id }
  })

  if (!benefit) return null

  return {
    id: benefit.id,
    name: benefit.name,
    category: benefit.category,
    description: benefit.description,
    estimatedAmount: benefit.estimatedAmount,
    eligibility: benefit.eligibility,
    link: benefit.link,
    minAge: benefit.minAge,
    maxAge: benefit.maxAge,
    minIncome: benefit.minIncome,
    maxIncome: benefit.maxIncome,
    region: benefit.region
  }
}

export async function getCategories(): Promise<Array<{ name: string; count: number }>> {
  const categories = await prisma.benefit.groupBy({
    by: ['category'],
    _count: { category: true },
    orderBy: { _count: { category: 'desc' } }
  })

  return categories.map(c => ({
    name: c.category,
    count: c._count.category
  }))
}

export async function getRegions(): Promise<string[]> {
  const regions = await prisma.benefit.findMany({
    select: { region: true },
    distinct: ['region'],
    where: { region: { not: null } }
  })

  return regions.map(r => r.region).filter((r): r is string => r !== null)
}

/**
 * 지역별 서비스 개수 조회
 * - 지역별 통계를 서비스 개수 내림차순으로 반환
 * - NULL 지역은 제외
 */
export async function getRegionCounts(): Promise<{ region: string; count: number }[]> {
  const counts = await prisma.benefit.groupBy({
    by: ['region'],
    _count: { id: true },
    where: { region: { not: null } },
    orderBy: { _count: { id: 'desc' } }
  });

  return counts.map(c => ({
    region: c.region!,
    count: c._count.id
  }));
}

// 세션별 조회 기록 (메모리 기반, 서버 재시작 시 초기화)
const viewedBenefits = new Set<string>()

// 인기 서비스 캐시 (5분 TTL)
let popularBenefitsCache: { data: SimpleBenefit[]; timestamp: number } | null = null
const POPULAR_CACHE_TTL = 5 * 60 * 1000 // 5분

/**
 * 인기 서비스 조회 (viewCount 기준)
 * - 5분 TTL 메모리 캐시 적용
 * - viewCount는 보조금24 API 전체 조회수
 */
export async function getPopularBenefits(limit: number = 10): Promise<SimpleBenefit[]> {
  // 캐시 확인
  if (popularBenefitsCache && Date.now() - popularBenefitsCache.timestamp < POPULAR_CACHE_TTL) {
    return popularBenefitsCache.data.slice(0, limit)
  }

  // DB 조회 (viewCount 내림차순, 최대 20개 캐시)
  const benefits = await prisma.benefit.findMany({
    orderBy: { viewCount: 'desc' },
    take: 20,
    where: { viewCount: { not: null } }
  })

  const result: SimpleBenefit[] = benefits.map(b => ({
    id: b.id,
    name: b.name,
    category: b.category,
    description: b.description,
    link: b.link,
    viewCount: b.viewCount || 0,
    siteViewCount: b.siteViewCount || 0
  }))

  // 캐시 업데이트
  popularBenefitsCache = { data: result, timestamp: Date.now() }

  return result.slice(0, limit)
}

export async function getBenefitDetailWithRelated(id: string, sessionId?: string): Promise<BenefitDetailResponse | null> {
  // 상세 정보 조회
  let benefit = await prisma.benefit.findUnique({
    where: { id }
  })

  if (!benefit) return null

  // 온디맨드 조회: detailFetchedAt이 NULL이면 API 호출하여 상세 정보 가져오기
  if (!benefit.detailFetchedAt) {
    try {
      console.log(`[BenefitService] Fetching detail for ${id} on-demand`)
      const detailData = await fetchServiceDetail(id)

      if (detailData) {
        // DB 업데이트: requiredDocuments, onlineApplyUrl, relatedLaws, detailFetchedAt
        benefit = await prisma.benefit.update({
          where: { id },
          data: {
            requiredDocuments: detailData.구비서류 || null,
            onlineApplyUrl: detailData.온라인신청사이트URL || null,
            relatedLaws: detailData.법령 || null,
            detailFetchedAt: new Date()
          }
        })
        console.log(`[BenefitService] Detail fetched and saved for ${id}`)
      } else {
        console.warn(`[BenefitService] Detail not found for ${id}`)
      }
    } catch (error) {
      console.error(`[BenefitService] Failed to fetch detail for ${id}:`, error)
      // 에러 발생 시에도 기존 데이터로 계속 진행
    }
  }

  // 세션 기반 중복 조회 방지: 같은 세션에서 이미 본 benefit은 viewCount 증가 안 함
  const viewKey = sessionId ? `${sessionId}-${id}` : null
  const shouldIncrement = viewKey && !viewedBenefits.has(viewKey)

  let updatedBenefit = benefit
  if (shouldIncrement) {
    viewedBenefits.add(viewKey)
    updatedBenefit = await prisma.benefit.update({
      where: { id },
      data: {
        siteViewCount: (benefit.siteViewCount || 0) + 1
      }
    })
  }

  // 같은 카테고리의 관련 서비스 조회 (viewCount 높은 순, 현재 benefit 제외, 3개)
  const relatedBenefits = await prisma.benefit.findMany({
    where: {
      category: benefit.category,
      id: { not: id }
    },
    orderBy: {
      viewCount: 'desc'
    },
    take: 3
  })

  const benefitDetail: BenefitDetail = {
    id: updatedBenefit.id,
    name: updatedBenefit.name,
    category: updatedBenefit.category,
    description: updatedBenefit.description,
    supportDetails: updatedBenefit.supportDetails,
    targetAudience: updatedBenefit.targetAudience,
    selectionCriteria: updatedBenefit.selectionCriteria,
    requiredDocuments: updatedBenefit.requiredDocuments,
    applicationMethod: updatedBenefit.applicationMethod,
    applicationDeadline: updatedBenefit.applicationDeadline,
    organizationName: updatedBenefit.organizationName,
    contactInfo: updatedBenefit.contactInfo,
    link: updatedBenefit.link,
    viewCount: updatedBenefit.viewCount || 0,
    siteViewCount: updatedBenefit.siteViewCount || 0,
    minAge: updatedBenefit.minAge,
    maxAge: updatedBenefit.maxAge,
    minIncome: updatedBenefit.minIncome,
    maxIncome: updatedBenefit.maxIncome,
    region: updatedBenefit.region,
    onlineApplyUrl: updatedBenefit.onlineApplyUrl,
    relatedLaws: updatedBenefit.relatedLaws,
    supportType: updatedBenefit.supportType,
    applyAgency: updatedBenefit.applyAgency,
    officialConfirmDocs: updatedBenefit.officialConfirmDocs,
    identityConfirmDocs: updatedBenefit.identityConfirmDocs
  }

  const simpleBenefits: SimpleBenefit[] = relatedBenefits.map(b => ({
    id: b.id,
    name: b.name,
    category: b.category,
    description: b.description,
    link: b.link,
    viewCount: b.viewCount || 0,
    siteViewCount: b.siteViewCount || 0
  }))

  return {
    benefit: benefitDetail,
    relatedBenefits: simpleBenefits
  }
}
