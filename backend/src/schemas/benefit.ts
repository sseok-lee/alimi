import { z } from 'zod'

// 검색 요청 스키마
export const BenefitSearchSchema = z.object({
  age: z.number().int().min(0).max(150).optional(),
  income: z.number().int().min(0).optional(),
  region: z.string().max(50).optional()
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
