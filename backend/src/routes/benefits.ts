import { Router, Request, Response, NextFunction } from 'express'
import { BenefitSearchSchema } from '../schemas/benefit.js'
import * as benefitService from '../services/benefitService.js'

const router = Router()

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

    const benefits = await benefitService.searchBenefits(result.data)

    res.json({
      benefits,
      total: benefits.length,
      searchParams: result.data
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/benefits/:id - 지원금 상세 조회
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const benefit = await benefitService.getBenefitById(req.params.id)

    if (!benefit) {
      return res.status(404).json({ error: 'Benefit not found' })
    }

    res.json(benefit)
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
