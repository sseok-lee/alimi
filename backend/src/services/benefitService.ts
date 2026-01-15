import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { BenefitSearchInput, BenefitResponse, BenefitDetailResponse, BenefitDetail, SimpleBenefit } from '../schemas/benefit.js'

export interface SearchResult {
  benefits: BenefitResponse[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
}

export async function searchBenefits(params: BenefitSearchInput): Promise<SearchResult> {
  const { age, income, region, category, lifePregnancy, targetDisabled, familySingleParent, familyMultiChild, page = 1, limit = 20 } = params

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

  const skip = (page - 1) * limit
  const take = limit

  // 병렬로 데이터와 총 개수 조회
  const [benefits, totalCount] = await Promise.all([
    prisma.benefit.findMany({
      where,
      skip,
      take,
      orderBy: { fetchedAt: 'desc' }
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

export async function getBenefitDetailWithRelated(id: string): Promise<BenefitDetailResponse | null> {
  // 상세 정보 조회 및 viewCount 증가
  const benefit = await prisma.benefit.findUnique({
    where: { id }
  })

  if (!benefit) return null

  // viewCount 증가
  const updatedBenefit = await prisma.benefit.update({
    where: { id },
    data: {
      viewCount: (benefit.viewCount || 0) + 1
    }
  })

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
    minAge: updatedBenefit.minAge,
    maxAge: updatedBenefit.maxAge,
    minIncome: updatedBenefit.minIncome,
    maxIncome: updatedBenefit.maxIncome,
    region: updatedBenefit.region
  }

  const simpleBenefits: SimpleBenefit[] = relatedBenefits.map(b => ({
    id: b.id,
    name: b.name,
    category: b.category,
    description: b.description,
    link: b.link,
    viewCount: b.viewCount || 0
  }))

  return {
    benefit: benefitDetail,
    relatedBenefits: simpleBenefits
  }
}
