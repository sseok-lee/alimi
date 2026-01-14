import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { BenefitSearchInput, BenefitResponse } from '../schemas/benefit.js'

export async function searchBenefits(params: BenefitSearchInput): Promise<BenefitResponse[]> {
  const { age, income, region } = params

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

  const benefits = await prisma.benefit.findMany({
    where,
    orderBy: { fetchedAt: 'desc' }
  })

  return benefits.map(benefit => ({
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

export async function getCategories(): Promise<string[]> {
  const categories = await prisma.benefit.findMany({
    select: { category: true },
    distinct: ['category']
  })

  return categories.map(c => c.category)
}

export async function getRegions(): Promise<string[]> {
  const regions = await prisma.benefit.findMany({
    select: { region: true },
    distinct: ['region'],
    where: { region: { not: null } }
  })

  return regions.map(r => r.region).filter((r): r is string => r !== null)
}
