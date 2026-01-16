import { describe, it, expect, beforeAll, afterAll, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import SearchPage from '../../app/pages/search.vue'

// Mock API 서버 설정
const mockBenefits = [
  {
    id: 'benefit-001',
    name: '청년도약계좌',
    category: '금융지원',
    description: '5년간 매월 납입 시 정부기여금 지원',
    estimated_amount: '5년 후 5,000만원',
    eligibility: ['19~34세', '연소득 7,500만원 이하'],
    link: 'https://www.kinfa.or.kr/',
  },
  {
    id: 'benefit-002',
    name: '청년 월세 지원',
    category: '주거지원',
    description: '무주택 청년의 월세 지원',
    estimated_amount: '월 최대 20만원',
    eligibility: ['19~34세', '무주택자'],
    link: 'https://www.molit.go.kr/',
  },
]

const handlers = [
  http.post('http://localhost:8000/api/benefits/search', async ({ request }) => {
    const body = await request.json() as { age?: number; income?: number; region?: string; page?: number; limit?: number }

    if (!body.age || body.income === undefined || !body.region) {
      return HttpResponse.json({ error: 'Missing parameters' }, { status: 422 })
    }

    // 빈 결과를 반환하도록 쿼리 파라미터 확인 (age >= 95는 테스트용)
    if (body.age && body.age >= 95) {
      return HttpResponse.json({
        benefits: [],
        totalCount: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      })
    }

    const page = body.page || 1
    const limit = body.limit || 20
    const totalCount = mockBenefits.length

    return HttpResponse.json({
      benefits: mockBenefits,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    })
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Helper function to fill and submit the search form
async function fillAndSubmitForm(wrapper: ReturnType<typeof mount>, birthYear: number, birthMonth: number, birthDay: number) {
  const selects = wrapper.findAll('select')

  // 생년월일 입력 (년/월/일 select - 처음 3개)
  await selects[0].setValue(String(birthYear))
  await selects[1].setValue(String(birthMonth))
  await selects[2].setValue(String(birthDay))
  await wrapper.find('select[name="income"]').setValue('0')
  await wrapper.find('select[name="region"]').setValue('서울')

  // 폼 제출
  await wrapper.find('form').trigger('submit')

  // API 호출 대기
  await new Promise((resolve) => setTimeout(resolve, 100))
}

describe('search.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-15'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('페이지가 렌더링되어야 한다', () => {
    const wrapper = mount(SearchPage)
    expect(wrapper.exists()).toBe(true)
  })

  it('SearchForm 컴포넌트가 렌더링되어야 한다', () => {
    const wrapper = mount(SearchPage)
    const searchForm = wrapper.findComponent({ name: 'SearchForm' })
    expect(searchForm.exists()).toBe(true)
  })

  it('초기에는 결과가 표시되지 않아야 한다', () => {
    const wrapper = mount(SearchPage)
    const benefitCards = wrapper.findAllComponents({ name: 'BenefitCard' })
    expect(benefitCards.length).toBe(0)
  })

  it('검색 후 BenefitCard들이 렌더링되어야 한다', async () => {
    vi.useRealTimers() // API 호출에는 실제 타이머 필요

    const wrapper = mount(SearchPage)

    await fillAndSubmitForm(wrapper, 1998, 6, 15)

    // BenefitCard가 렌더링되었는지 확인
    const benefitCards = wrapper.findAllComponents({ name: 'BenefitCard' })
    expect(benefitCards.length).toBe(2)
  })

  it('결과가 2개면 2개의 카드가 표시되어야 한다', async () => {
    vi.useRealTimers()

    const wrapper = mount(SearchPage)

    await fillAndSubmitForm(wrapper, 1998, 6, 15)

    const benefitCards = wrapper.findAllComponents({ name: 'BenefitCard' })
    expect(benefitCards.length).toBe(mockBenefits.length)
  })

  it('검색 결과가 0개면 "결과 없음" 메시지가 표시되어야 한다', async () => {
    vi.useRealTimers()

    const wrapper = mount(SearchPage)

    // 빈 결과를 받기 위해 1926년 사용 (만 99세 → Mock 서버에서 빈 배열 반환)
    await fillAndSubmitForm(wrapper, 1926, 6, 15)

    // "결과 없음" 메시지 확인
    expect(wrapper.text()).toContain('검색 결과가 없습니다')
  })

  it('에러 발생 시 에러 메시지가 표시되어야 한다', async () => {
    vi.useRealTimers()

    // 에러를 반환하도록 Mock 재설정
    server.use(
      http.post('http://localhost:8000/api/benefits/search', () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 })
      }),
    )

    const wrapper = mount(SearchPage)

    await fillAndSubmitForm(wrapper, 1998, 6, 15)

    // 에러 메시지가 표시되어야 함
    expect(wrapper.text()).toContain('검색에 실패했습니다')
  })

  it('검색 결과 개수가 표시되어야 한다', async () => {
    vi.useRealTimers()

    const wrapper = mount(SearchPage)

    await fillAndSubmitForm(wrapper, 1998, 6, 15)

    // "총 X개의 지원금 중" 메시지 확인 (새 형식)
    expect(wrapper.text()).toContain('총')
    expect(wrapper.text()).toContain('개의 지원금 중')
  })

  it('반응형 그리드가 적용되어야 한다', async () => {
    vi.useRealTimers()

    const wrapper = mount(SearchPage)

    await fillAndSubmitForm(wrapper, 1998, 6, 15)

    // 그리드 컨테이너 클래스 확인
    const gridContainer = wrapper.find('.grid')
    expect(gridContainer.exists()).toBe(true)
  })
})
