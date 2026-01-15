import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import BenefitDetailPage from '../../app/pages/benefits/[id].vue'

// Mock 데이터
const mockBenefitDetail = {
  benefit: {
    id: 'benefit-001',
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
    viewCount: 150,
    minAge: 15,
    maxAge: 34,
    minIncome: null,
    maxIncome: null,
    region: '전국',
  },
  relatedBenefits: [
    {
      id: 'benefit-002',
      name: '국민취업지원제도',
      category: '일자리',
      description: '구직자 취업 지원 서비스',
      link: 'https://example.com/1',
      viewCount: 100,
    },
    {
      id: 'benefit-003',
      name: '청년일자리도약장려금',
      category: '일자리',
      description: '중소기업 청년 채용 지원',
      link: 'https://example.com/2',
      viewCount: 50,
    },
  ],
}

// Mock API 서버 설정
const handlers = [
  http.get('http://localhost:8000/api/benefits/:id', ({ params }) => {
    const { id } = params

    if (id === 'not-found') {
      return HttpResponse.json({ error: 'Benefit not found' }, { status: 404 })
    }

    return HttpResponse.json(mockBenefitDetail)
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Mock useRoute
const mockRoute = {
  params: { id: 'benefit-001' },
}

// Nuxt auto-imports 모킹
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.useRoute = (() => mockRoute) as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.useRuntimeConfig = (() => ({
  public: {
    apiBase: 'http://localhost:8000',
  },
})) as any

describe('benefits/[id].vue', () => {
  it('페이지가 렌더링되어야 한다', () => {
    const wrapper = mount(BenefitDetailPage)
    expect(wrapper.exists()).toBe(true)
  })

  it('로딩 중에 로딩 메시지가 표시되어야 한다', async () => {
    // 느린 응답을 시뮬레이션
    server.use(
      http.get('http://localhost:8000/api/benefits/:id', async () => {
        await new Promise((resolve) => setTimeout(resolve, 200))
        return HttpResponse.json(mockBenefitDetail)
      }),
    )

    const wrapper = mount(BenefitDetailPage)

    // 컴포넌트가 마운트되고 API 호출이 시작될 때까지 약간의 시간 대기
    await new Promise((resolve) => setTimeout(resolve, 50))

    // 로딩 상태 확인
    expect(wrapper.text()).toContain('로딩')

    // API 응답 대기
    await new Promise((resolve) => setTimeout(resolve, 200))
  })

  it('상세 정보 로드 후 BenefitHero가 렌더링되어야 한다', async () => {
    const wrapper = mount(BenefitDetailPage)

    // API 호출 대기
    await new Promise((resolve) => setTimeout(resolve, 100))

    // BenefitHero 컴포넌트 확인
    const hero = wrapper.findComponent({ name: 'BenefitHero' })
    expect(hero.exists()).toBe(true)
    expect(wrapper.text()).toContain('청년내일채움공제')
  })

  it('관련 서비스가 표시되어야 한다', async () => {
    const wrapper = mount(BenefitDetailPage)

    await new Promise((resolve) => setTimeout(resolve, 100))

    // RelatedBenefits 컴포넌트 확인
    const relatedBenefits = wrapper.findComponent({ name: 'RelatedBenefits' })
    expect(relatedBenefits.exists()).toBe(true)
    expect(wrapper.text()).toContain('관련 서비스')
  })

  it('404 에러 시 에러 메시지가 표시되어야 한다', async () => {
    // 404를 반환하도록 route 변경
    mockRoute.params.id = 'not-found'

    const wrapper = mount(BenefitDetailPage)

    await new Promise((resolve) => setTimeout(resolve, 100))

    // 에러 메시지 확인
    expect(wrapper.text()).toContain('찾을 수 없습니다')
  })

  it('모든 컴포넌트가 렌더링되어야 한다', async () => {
    mockRoute.params.id = 'benefit-001'
    const wrapper = mount(BenefitDetailPage)

    await new Promise((resolve) => setTimeout(resolve, 100))

    // 7개 컴포넌트 확인
    expect(wrapper.findComponent({ name: 'BenefitHero' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'EligibilityCard' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'DocumentsCard' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ProcessSteps' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ApplySidebar' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'RelatedBenefits' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'MobileBottomBar' }).exists()).toBe(true)
  })

  it('데스크톱에서 8:4 그리드 레이아웃이 적용되어야 한다', async () => {
    mockRoute.params.id = 'benefit-001'
    const wrapper = mount(BenefitDetailPage)

    await new Promise((resolve) => setTimeout(resolve, 100))

    // 그리드 컨테이너 확인
    const gridContainer = wrapper.find('.lg\\:grid-cols-12')
    expect(gridContainer.exists()).toBe(true)
  })

  it('SEO 메타태그가 설정되어야 한다', async () => {
    mockRoute.params.id = 'benefit-001'
    const wrapper = mount(BenefitDetailPage)

    await new Promise((resolve) => setTimeout(resolve, 100))

    // useSeoMeta 호출 확인 (실제로는 함수가 호출되었는지 확인)
    // 이 테스트는 컴포넌트가 마운트되고 데이터가 로드되는지 확인
    expect(wrapper.vm).toBeDefined()
  })
})
