import { Router, Request, Response, NextFunction } from 'express'
import { BenefitSearchSchema } from '../schemas/benefit.js'
import * as benefitService from '../services/benefitService.js'
import prisma from '../lib/prisma.js'
import crypto from 'crypto'

const router = Router()

/**
 * Generate a session ID from request IP and user-agent
 * Used for anonymous search log tracking
 */
function generateSessionId(req: Request): string {
  const identifier = (req.ip || 'unknown') + (req.headers['user-agent'] || 'unknown')
  return crypto.createHash('sha256')
    .update(identifier)
    .digest('hex')
    .substring(0, 16)
}

// POST /api/benefits/search - 맞춤 지원금 검색
router.post('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = BenefitSearchSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(422).json({
        error: 'Validation Error',
        details: result.error.flatten()
      })
    }

    const searchResult = await benefitService.searchBenefits(result.data)

    // Record search log (don't fail request if logging fails)
    try {
      await prisma.searchLog.create({
        data: {
          sessionId: generateSessionId(req),
          age: result.data.age ?? null,
          income: result.data.income ?? null,
          region: result.data.region ?? null,
          resultCount: searchResult.totalCount,
          searchedAt: new Date()
        }
      })
    } catch (logError) {
      console.error('Failed to record search log:', logError)
      // Don't fail the request if logging fails
    }

    res.json({
      benefits: searchResult.benefits,
      totalCount: searchResult.totalCount,
      page: searchResult.page,
      limit: searchResult.limit,
      totalPages: searchResult.totalPages,
      searchParams: result.data
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/benefits/:id - 지원금 상세 조회
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const sessionId = generateSessionId(req)
    const result = await benefitService.getBenefitDetailWithRelated(id, sessionId)

    if (!result) {
      return res.status(404).json({ error: 'Benefit not found' })
    }

    res.json(result)
  } catch (error) {
    next(error)
  }
})

// GET /api/benefits/meta/categories - 카테고리 목록
router.get('/meta/categories', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await benefitService.getCategories()
    res.json({ categories })
  } catch (error) {
    next(error)
  }
})

// GET /api/benefits/meta/regions - 지역 목록
router.get('/meta/regions', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const regions = await benefitService.getRegions()
    res.json({ regions })
  } catch (error) {
    next(error)
  }
})

export default router
