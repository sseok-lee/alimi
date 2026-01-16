import { z } from 'zod'

// 검색 요청 스키마
export const BenefitSearchSchema = z.object({
  // 기존 필터
  age: z.number().int().min(0).max(150).optional(),
  income: z.number().int().min(0).optional(),
  region: z.string().max(50).optional(),

  // 신규 필터 (MVP)
  category: z.string().optional(),           // 카테고리 필터
  lifePregnancy: z.boolean().optional(),     // 임신/출산 (lifePregnant, lifeBirth)
  targetDisabled: z.boolean().optional(),    // 장애인 (targetDisabled)
  familySingleParent: z.boolean().optional(), // 한부모/조손 (familySingleParent)
  familyMultiChild: z.boolean().optional(),  // 다자녀 (familyMultiChild)

  // Phase 8 추가 필터
  jobSeeker: z.boolean().optional(),           // 구직자/실업자
  lifeUniversity: z.boolean().optional(),      // 대학생/대학원생
  familySinglePerson: z.boolean().optional(),  // 1인가구
  familyNoHouse: z.boolean().optional(),       // 무주택세대
  jobEmployee: z.boolean().optional(),         // 근로자/직장인
  targetVeteran: z.boolean().optional(),       // 국가보훈대상자

  // 지원유형 필터
  supportType: z.string().optional(),          // 현금/현물/서비스 등

  // 신청 필터
  onlineApplyAvailable: z.boolean().optional(), // 온라인 신청 가능 여부
  alwaysOpen: z.boolean().optional(),          // 상시 신청 가능 여부

  // 정렬
  sortBy: z.enum(['latest', 'popular']).default('latest').optional(),

  // 페이지네이션
  page: z.number().int().min(1).default(1).optional(),
  limit: z.number().int().min(1).max(100).default(20).optional()
})

export type BenefitSearchInput = z.infer<typeof BenefitSearchSchema>

// 지원금 응답 스키마
export const BenefitResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string().nullable(),
  estimatedAmount: z.string().nullable(),
  eligibility: z.any().nullable(),
  link: z.string(),
  minAge: z.number().nullable(),
  maxAge: z.number().nullable(),
  minIncome: z.number().nullable(),
  maxIncome: z.number().nullable(),
  region: z.string().nullable()
})

export type BenefitResponse = z.infer<typeof BenefitResponseSchema>

// 검색 결과 스키마
export const SearchResultSchema = z.object({
  benefits: z.array(BenefitResponseSchema),
  total: z.number(),
  searchParams: BenefitSearchSchema
})

export type SearchResult = z.infer<typeof SearchResultSchema>

// 상세 조회 응답 스키마
export const BenefitDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string().nullable(),
  supportDetails: z.string().nullable(),
  targetAudience: z.string().nullable(),
  selectionCriteria: z.string().nullable(),
  requiredDocuments: z.string().nullable(),
  applicationMethod: z.string().nullable(),
  applicationDeadline: z.string().nullable(),
  organizationName: z.string().nullable(),
  contactInfo: z.string().nullable(),
  link: z.string(),
  viewCount: z.number(),
  minAge: z.number().nullable(),
  maxAge: z.number().nullable(),
  minIncome: z.number().nullable(),
  maxIncome: z.number().nullable(),
  region: z.string().nullable(),
  onlineApplyUrl: z.string().nullable(),
  relatedLaws: z.string().nullable(),
  supportType: z.string().nullable(),
  applyAgency: z.string().nullable(),
  officialConfirmDocs: z.string().nullable(),
  identityConfirmDocs: z.string().nullable()
})

export type BenefitDetail = z.infer<typeof BenefitDetailSchema>

// 간단한 지원금 정보 (관련 서비스용)
export const SimpleBenefitSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string().nullable(),
  link: z.string(),
  viewCount: z.number()
})

export type SimpleBenefit = z.infer<typeof SimpleBenefitSchema>

// 상세 조회 응답 전체 스키마
export const BenefitDetailResponseSchema = z.object({
  benefit: BenefitDetailSchema,
  relatedBenefits: z.array(SimpleBenefitSchema)
})

export type BenefitDetailResponse = z.infer<typeof BenefitDetailResponseSchema>
