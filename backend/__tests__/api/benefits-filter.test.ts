import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../../src/app.js'
import { prisma } from '../../src/lib/prisma.js'

describe('Benefits API - Filter Extension (MVP)', () => {
  beforeAll(async () => {
    // Cleanup test data
    await prisma.benefit.deleteMany({
      where: {
        id: { startsWith: 'test-filter-' }
      }
    })

    // Create test benefits with various filter attributes
    await prisma.benefit.createMany({
      data: [
        {
          id: 'test-filter-pregnancy-1',
          name: '임신부 지원금',
          category: '임신·출산',
          link: 'https://example.com',
          lifePregnant: true,
          region: '서울'
        },
        {
          id: 'test-filter-disabled-1',
          name: '장애인 지원금',
          category: '장애인',
          link: 'https://example.com',
          targetDisabled: true,
          region: '서울'
        },
        {
          id: 'test-filter-single-parent-1',
          name: '한부모가정 지원금',
          category: '한부모·조손',
          link: 'https://example.com',
          familySingleParent: true,
          region: '서울'
        },
        {
          id: 'test-filter-multi-child-1',
          name: '다자녀가구 지원금',
          category: '다자녀',
          link: 'https://example.com',
          familyMultiChild: true,
          region: '서울'
        },
        {
          id: 'test-filter-general-1',
          name: '일반 지원금',
          category: '일반',
          link: 'https://example.com',
          region: '서울'
        }
      ]
    })
  })

  afterAll(async () => {
    // Cleanup test data
    await prisma.benefit.deleteMany({
      where: {
        id: { startsWith: 'test-filter-' }
      }
    })
  })

  describe('POST /api/benefits/search - 필터 테스트', () => {
    it('카테고리 필터가 동작한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({ category: '임신·출산' })
        .expect(200)

      expect(response.body.benefits).toBeDefined()
      expect(Array.isArray(response.body.benefits)).toBe(true)

      const testBenefit = response.body.benefits.find((b: any) => b.id === 'test-filter-pregnancy-1')
      expect(testBenefit).toBeDefined()
      expect(testBenefit?.category).toBe('임신·출산')
    })

    it('임신/출산 필터가 동작한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({ lifePregnancy: true })
        .expect(200)

      expect(response.body.benefits).toBeDefined()
      const testBenefit = response.body.benefits.find((b: any) => b.id === 'test-filter-pregnancy-1')
      expect(testBenefit).toBeDefined()
    })

    it('장애인 필터가 동작한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({ targetDisabled: true })
        .expect(200)

      expect(response.body.benefits).toBeDefined()
      const testBenefit = response.body.benefits.find((b: any) => b.id === 'test-filter-disabled-1')
      expect(testBenefit).toBeDefined()
    })

    it('한부모/조손 필터가 동작한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({ familySingleParent: true })
        .expect(200)

      expect(response.body.benefits).toBeDefined()
      const testBenefit = response.body.benefits.find((b: any) => b.id === 'test-filter-single-parent-1')
      expect(testBenefit).toBeDefined()
    })

    it('다자녀 필터가 동작한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({ familyMultiChild: true })
        .expect(200)

      expect(response.body.benefits).toBeDefined()
      const testBenefit = response.body.benefits.find((b: any) => b.id === 'test-filter-multi-child-1')
      expect(testBenefit).toBeDefined()
    })

    it('페이지네이션이 동작한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({ region: '서울', page: 1, limit: 2 })
        .expect(200)

      expect(response.body.benefits).toBeDefined()
      expect(response.body.benefits.length).toBeLessThanOrEqual(2)
    })

    it('여러 필터를 조합할 수 있다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({
          region: '서울',
          category: '임신·출산',
          lifePregnancy: true
        })
        .expect(200)

      expect(response.body.benefits).toBeDefined()
      const testBenefit = response.body.benefits.find((b: any) => b.id === 'test-filter-pregnancy-1')
      expect(testBenefit).toBeDefined()
    })
  })

  describe('GET /api/benefits/meta/categories - 카테고리 목록', () => {
    it('카테고리 목록과 카운트를 반환한다', async () => {
      const response = await request(app)
        .get('/api/benefits/meta/categories')
        .expect(200)

      expect(response.body.categories).toBeDefined()
      expect(Array.isArray(response.body.categories)).toBe(true)

      if (response.body.categories.length > 0) {
        const category = response.body.categories[0]
        expect(category).toHaveProperty('name')
        expect(category).toHaveProperty('count')
        expect(typeof category.count).toBe('number')
      }
    })
  })
})
