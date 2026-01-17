import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../../src/app.js'
import { prisma } from '../../src/lib/prisma.js'

describe('GET /api/benefits/:id - 지원금 상세 조회', () => {
  let testBenefitId: string
  let sameCategoryBenefitIds: string[] = []

  const TEST_IDS = [
    'TEST_DETAIL_MAIN_001',
    'TEST_DETAIL_RELATED_001',
    'TEST_DETAIL_RELATED_002',
    'TEST_DETAIL_RELATED_003',
    'TEST_DETAIL_OTHER_001'
  ]

  beforeAll(async () => {
    // 먼저 기존 테스트 데이터 정리 (이전 실행에서 남아있을 수 있음)
    await prisma.benefit.deleteMany({
      where: { id: { in: TEST_IDS } }
    })

    // 테스트용 데이터 생성
    // 메인 benefit (조회 대상)
    const mainBenefit = await prisma.benefit.create({
      data: {
        id: 'TEST_DETAIL_MAIN_001',
        name: '청년내일채움공제',
        category: '일자리',
        description: '청년 정규직 근로자의 자산형성을 지원합니다.',
        supportDetails: '2년간 최대 1,200만원 지원',
        targetAudience: '만 15~34세 청년',
        selectionCriteria: '중소기업 정규직 입사자',
        requiredDocuments: '재직증명서, 주민등록등본',
        applicationMethod: '고용24 홈페이지 신청',
        applicationDeadline: '상시',
        organizationName: '고용노동부',
        contactInfo: '1350',
        link: 'https://www.work.go.kr/youngtomorrow',
        viewCount: 10,
        minAge: 15,
        maxAge: 34,
        minIncome: null,
        maxIncome: null,
        region: '전국',
        source: 'test',
        fetchedAt: new Date()
      }
    })
    testBenefitId = mainBenefit.id

    // 같은 카테고리의 다른 benefit 3개 (viewCount 높은 순)
    const relatedBenefit1 = await prisma.benefit.create({
      data: {
        id: 'TEST_DETAIL_RELATED_001',
        name: '국민취업지원제도',
        category: '일자리',
        description: '구직자 취업 지원 서비스',
        link: 'https://example.com/1',
        viewCount: 100,
        source: 'test',
        fetchedAt: new Date()
      }
    })

    const relatedBenefit2 = await prisma.benefit.create({
      data: {
        id: 'TEST_DETAIL_RELATED_002',
        name: '청년일자리도약장려금',
        category: '일자리',
        description: '중소기업 청년 채용 지원',
        link: 'https://example.com/2',
        viewCount: 50,
        source: 'test',
        fetchedAt: new Date()
      }
    })

    const relatedBenefit3 = await prisma.benefit.create({
      data: {
        id: 'TEST_DETAIL_RELATED_003',
        name: '취업성공패키지',
        category: '일자리',
        description: '취업 지원 프로그램',
        link: 'https://example.com/3',
        viewCount: 30,
        source: 'test',
        fetchedAt: new Date()
      }
    })

    sameCategoryBenefitIds = [
      relatedBenefit1.id,
      relatedBenefit2.id,
      relatedBenefit3.id
    ]

    // 다른 카테고리 benefit (관련 서비스에 나오면 안됨)
    await prisma.benefit.create({
      data: {
        id: 'TEST_DETAIL_OTHER_001',
        name: '주거급여',
        category: '주거',
        description: '주거비 지원',
        link: 'https://example.com/other',
        viewCount: 200,
        source: 'test',
        fetchedAt: new Date()
      }
    })
  })

  afterAll(async () => {
    // 테스트 데이터 정리
    await prisma.benefit.deleteMany({
      where: { id: { in: TEST_IDS } }
    })
    await prisma.$disconnect()
  })

  it('존재하는 ID로 조회 시 상세 정보 + 관련 서비스 반환', async () => {
    const response = await request(app)
      .get(`/api/benefits/${testBenefitId}`)
      .expect(200)

    expect(response.body).toHaveProperty('benefit')
    expect(response.body).toHaveProperty('relatedBenefits')

    const { benefit, relatedBenefits } = response.body

    // 상세 정보 확인
    expect(benefit.id).toBe(testBenefitId)
    expect(benefit.name).toBe('청년내일채움공제')
    expect(benefit.category).toBe('일자리')
    expect(benefit.description).toBe('청년 정규직 근로자의 자산형성을 지원합니다.')
    expect(benefit.supportDetails).toBe('2년간 최대 1,200만원 지원')
    expect(benefit.targetAudience).toBe('만 15~34세 청년')
    expect(benefit.selectionCriteria).toBe('중소기업 정규직 입사자')
    expect(benefit.requiredDocuments).toBe('재직증명서, 주민등록등본')
    expect(benefit.applicationMethod).toBe('고용24 홈페이지 신청')
    expect(benefit.applicationDeadline).toBe('상시')
    expect(benefit.organizationName).toBe('고용노동부')
    expect(benefit.contactInfo).toBe('1350')
    expect(benefit.link).toBe('https://www.work.go.kr/youngtomorrow')
    expect(benefit.viewCount).toBe(10) // viewCount는 오픈API 값 (변경되지 않음)
    expect(benefit.siteViewCount).toBe(1) // siteViewCount는 조회 후 1 증가
    expect(benefit.minAge).toBe(15)
    expect(benefit.maxAge).toBe(34)
    expect(benefit.region).toBe('전국')

    // 관련 서비스 확인
    expect(relatedBenefits).toHaveLength(3)
    expect(relatedBenefits[0].id).toBe('TEST_DETAIL_RELATED_001') // viewCount 100
    expect(relatedBenefits[1].id).toBe('TEST_DETAIL_RELATED_002') // viewCount 50
    expect(relatedBenefits[2].id).toBe('TEST_DETAIL_RELATED_003') // viewCount 30
  })

  it('존재하지 않는 ID로 조회 시 404 반환', async () => {
    const response = await request(app)
      .get('/api/benefits/NON_EXISTENT_ID')
      .expect(404)

    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Benefit not found')
  })

  it('새로운 세션에서 조회 시 siteViewCount 1 증가 확인', async () => {
    // 조회 전 siteViewCount 확인
    const beforeBenefit = await prisma.benefit.findUnique({
      where: { id: testBenefitId }
    })
    const beforeSiteViewCount = beforeBenefit?.siteViewCount || 0

    // 새로운 세션으로 조회 (고유한 User-Agent 사용)
    const uniqueUserAgent = `TestAgent-${Date.now()}-${Math.random()}`
    await request(app)
      .get(`/api/benefits/${testBenefitId}`)
      .set('User-Agent', uniqueUserAgent)
      .expect(200)

    // 조회 후 siteViewCount 확인
    const afterBenefit = await prisma.benefit.findUnique({
      where: { id: testBenefitId }
    })
    const afterSiteViewCount = afterBenefit?.siteViewCount || 0

    expect(afterSiteViewCount).toBe(beforeSiteViewCount + 1)
  })

  it('같은 세션에서 중복 조회 시 siteViewCount 증가하지 않음', async () => {
    // 고유한 세션 생성
    const uniqueUserAgent = `TestAgent-Duplicate-${Date.now()}`

    // 첫 번째 조회
    await request(app)
      .get(`/api/benefits/${testBenefitId}`)
      .set('User-Agent', uniqueUserAgent)
      .expect(200)

    // 조회 후 siteViewCount 확인
    const afterFirstBenefit = await prisma.benefit.findUnique({
      where: { id: testBenefitId }
    })
    const afterFirstSiteViewCount = afterFirstBenefit?.siteViewCount || 0

    // 같은 세션으로 두 번째 조회
    await request(app)
      .get(`/api/benefits/${testBenefitId}`)
      .set('User-Agent', uniqueUserAgent)
      .expect(200)

    // 두 번째 조회 후 siteViewCount 확인 - 증가하지 않아야 함
    const afterSecondBenefit = await prisma.benefit.findUnique({
      where: { id: testBenefitId }
    })
    const afterSecondSiteViewCount = afterSecondBenefit?.siteViewCount || 0

    expect(afterSecondSiteViewCount).toBe(afterFirstSiteViewCount)
  })

  it('관련 서비스는 같은 카테고리 + viewCount 높은 순 3개', async () => {
    const response = await request(app)
      .get(`/api/benefits/${testBenefitId}`)
      .expect(200)

    const { relatedBenefits } = response.body

    // 3개만 반환
    expect(relatedBenefits).toHaveLength(3)

    // 모두 같은 카테고리
    relatedBenefits.forEach((b: any) => {
      expect(b.category).toBe('일자리')
    })

    // viewCount 내림차순 확인
    expect(relatedBenefits[0].viewCount).toBeGreaterThanOrEqual(relatedBenefits[1].viewCount)
    expect(relatedBenefits[1].viewCount).toBeGreaterThanOrEqual(relatedBenefits[2].viewCount)
  })

  it('관련 서비스에서 현재 조회 중인 benefit 제외', async () => {
    const response = await request(app)
      .get(`/api/benefits/${testBenefitId}`)
      .expect(200)

    const { relatedBenefits } = response.body

    // 현재 조회 중인 benefit이 관련 서비스에 없어야 함
    const relatedIds = relatedBenefits.map((b: any) => b.id)
    expect(relatedIds).not.toContain(testBenefitId)
  })
})
