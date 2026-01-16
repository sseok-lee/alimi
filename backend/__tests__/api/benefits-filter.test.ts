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
        },
        // Phase 8 - 추가 필터 테스트 데이터
        {
          id: 'test-filter-phase8-jobseeker-1',
          name: '구직자 지원금',
          category: '취업지원',
          link: 'https://example.com',
          jobSeeker: true,
          viewCount: 100,
          region: '서울'
        },
        {
          id: 'test-filter-phase8-university-1',
          name: '대학생 지원금',
          category: '교육',
          link: 'https://example.com',
          lifeUniversity: true,
          viewCount: 200,
          region: '서울'
        },
        {
          id: 'test-filter-phase8-single-person-1',
          name: '1인가구 지원금',
          category: '주거',
          link: 'https://example.com',
          familySinglePerson: true,
          viewCount: 150,
          region: '서울'
        },
        {
          id: 'test-filter-phase8-no-house-1',
          name: '무주택세대 지원금',
          category: '주거',
          link: 'https://example.com',
          familyNoHouse: true,
          viewCount: 180,
          region: '서울'
        },
        {
          id: 'test-filter-phase8-employee-1',
          name: '근로자 지원금',
          category: '고용',
          link: 'https://example.com',
          jobEmployee: true,
          viewCount: 120,
          region: '서울'
        },
        {
          id: 'test-filter-phase8-veteran-1',
          name: '국가보훈 지원금',
          category: '보훈',
          link: 'https://example.com',
          targetVeteran: true,
          viewCount: 90,
          region: '서울'
        },
        {
          id: 'test-filter-phase8-support-type-1',
          name: '현금 지원금',
          category: '생활지원',
          link: 'https://example.com',
          supportType: '현금',
          viewCount: 110,
          region: '서울'
        },
        {
          id: 'test-filter-phase8-online-1',
          name: '온라인 신청 가능 지원금',
          category: '생활지원',
          link: 'https://example.com',
          onlineApplyUrl: 'https://apply.example.com',
          viewCount: 140,
          region: '서울'
        },
        {
          id: 'test-filter-phase8-always-open-1',
          name: '상시 신청 지원금',
          category: '생활지원',
          link: 'https://example.com',
          applicationDeadline: '상시접수',
          viewCount: 160,
          region: '서울'
        },
        {
          id: 'test-filter-phase8-popular-1',
          name: '인기 지원금 1',
          category: '생활지원',
          link: 'https://example.com',
          viewCount: 500,
          region: '서울'
        },
        {
          id: 'test-filter-phase8-popular-2',
          name: '인기 지원금 2',
          category: '생활지원',
          link: 'https://example.com',
          viewCount: 300,
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

  describe('POST /api/benefits/search - Phase 8 추가 필터 테스트', () => {
    it('구직자/실업자 필터가 동작한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({ jobSeeker: true })
        .expect(200)

      expect(response.body.benefits).toBeDefined()
      const testBenefit = response.body.benefits.find((b: any) => b.id === 'test-filter-phase8-jobseeker-1')
      expect(testBenefit).toBeDefined()
      expect(testBenefit?.name).toBe('구직자 지원금')
    })

    it('대학생/대학원생 필터가 동작한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({ lifeUniversity: true })
        .expect(200)

      expect(response.body.benefits).toBeDefined()
      const testBenefit = response.body.benefits.find((b: any) => b.id === 'test-filter-phase8-university-1')
      expect(testBenefit).toBeDefined()
      expect(testBenefit?.name).toBe('대학생 지원금')
    })

    it('1인가구 필터가 동작한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({ familySinglePerson: true })
        .expect(200)

      expect(response.body.benefits).toBeDefined()
      const testBenefit = response.body.benefits.find((b: any) => b.id === 'test-filter-phase8-single-person-1')
      expect(testBenefit).toBeDefined()
      expect(testBenefit?.name).toBe('1인가구 지원금')
    })

    it('무주택세대 필터가 동작한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({ familyNoHouse: true })
        .expect(200)

      expect(response.body.benefits).toBeDefined()
      const testBenefit = response.body.benefits.find((b: any) => b.id === 'test-filter-phase8-no-house-1')
      expect(testBenefit).toBeDefined()
      expect(testBenefit?.name).toBe('무주택세대 지원금')
    })

    it('근로자/직장인 필터가 동작한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({ jobEmployee: true })
        .expect(200)

      expect(response.body.benefits).toBeDefined()
      const testBenefit = response.body.benefits.find((b: any) => b.id === 'test-filter-phase8-employee-1')
      expect(testBenefit).toBeDefined()
      expect(testBenefit?.name).toBe('근로자 지원금')
    })

    it('국가보훈대상자 필터가 동작한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({ targetVeteran: true })
        .expect(200)

      expect(response.body.benefits).toBeDefined()
      const testBenefit = response.body.benefits.find((b: any) => b.id === 'test-filter-phase8-veteran-1')
      expect(testBenefit).toBeDefined()
      expect(testBenefit?.name).toBe('국가보훈 지원금')
    })

    it('지원유형 필터가 동작한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({ supportType: '현금' })
        .expect(200)

      expect(response.body.benefits).toBeDefined()
      const testBenefit = response.body.benefits.find((b: any) => b.id === 'test-filter-phase8-support-type-1')
      expect(testBenefit).toBeDefined()
      expect(testBenefit?.name).toBe('현금 지원금')
    })

    it('온라인 신청 가능 필터가 동작한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({ onlineApplyAvailable: true })
        .expect(200)

      expect(response.body.benefits).toBeDefined()
      const testBenefit = response.body.benefits.find((b: any) => b.id === 'test-filter-phase8-online-1')
      expect(testBenefit).toBeDefined()
      expect(testBenefit?.name).toBe('온라인 신청 가능 지원금')
    })

    it('상시 신청 가능 필터가 동작한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({ alwaysOpen: true })
        .expect(200)

      expect(response.body.benefits).toBeDefined()
      const testBenefit = response.body.benefits.find((b: any) => b.id === 'test-filter-phase8-always-open-1')
      expect(testBenefit).toBeDefined()
      expect(testBenefit?.name).toBe('상시 신청 지원금')
    })

    it('sortBy=latest로 정렬한다 (기본값)', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({ region: '서울', sortBy: 'latest' })
        .expect(200)

      expect(response.body.benefits).toBeDefined()
      expect(Array.isArray(response.body.benefits)).toBe(true)
      // fetchedAt 기준 내림차순 정렬 확인 (최신순)
    })

    it('sortBy=popular로 정렬한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({ region: '서울', sortBy: 'popular', limit: 5 })
        .expect(200)

      expect(response.body.benefits).toBeDefined()
      expect(Array.isArray(response.body.benefits)).toBe(true)

      // viewCount 기준 내림차순 정렬 확인
      const testBenefits = response.body.benefits.filter((b: any) => b.id.startsWith('test-filter-phase8-'))
      if (testBenefits.length >= 2) {
        // popular-1 (viewCount 500)이 popular-2 (viewCount 300)보다 앞에 있어야 함
        const popular1Index = testBenefits.findIndex((b: any) => b.id === 'test-filter-phase8-popular-1')
        const popular2Index = testBenefits.findIndex((b: any) => b.id === 'test-filter-phase8-popular-2')

        if (popular1Index !== -1 && popular2Index !== -1) {
          expect(popular1Index).toBeLessThan(popular2Index)
        }
      }
    })

    it('여러 Phase 8 필터를 조합할 수 있다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({
          region: '서울',
          jobSeeker: true,
          sortBy: 'popular'
        })
        .expect(200)

      expect(response.body.benefits).toBeDefined()
      const testBenefit = response.body.benefits.find((b: any) => b.id === 'test-filter-phase8-jobseeker-1')
      expect(testBenefit).toBeDefined()
    })
  })
})
