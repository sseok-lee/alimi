import { describe, it, expect, beforeAll, afterAll, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import Index from '../../app/pages/index.vue'

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

describe('랜딩 페이지 (index.vue)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-15'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('메인 타이틀이 표시되어야 한다', () => {
    const wrapper = mount(Index)
    expect(wrapper.text()).toContain('나에게 맞는')
    expect(wrapper.text()).toContain('정부 지원금')
  })

  it('생년월일 선택 필드가 표시되어야 한다 (년/월/일 select)', () => {
    const wrapper = mount(Index)
    expect(wrapper.text()).toContain('생년월일')
    // SearchForm 컴포넌트가 년/월/일 select를 포함
    const selects = wrapper.findAll('select')
    expect(selects.length).toBeGreaterThan(3) // 년, 월, 일 + 소득, 지역, 카테고리
  })

  it('소득 선택 필드를 표시해야 한다', () => {
    const wrapper = mount(Index)
    const incomeSelect = wrapper.find('select[name="income"]')
    expect(incomeSelect.exists()).toBe(true)
  })

  it('지역 선택 필드를 표시해야 한다', () => {
    const wrapper = mount(Index)
    const regionSelect = wrapper.find('select[name="region"]')
    expect(regionSelect.exists()).toBe(true)
  })

  it('"지원금 찾기" 버튼을 표시해야 한다', () => {
    const wrapper = mount(Index)
    const button = wrapper.find('button[type="submit"]')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('지원금 찾기')
  })

  it('폼 제출 시 검색 결과를 표시해야 한다', async () => {
    vi.useRealTimers() // API 호출에는 실제 타이머 필요

    const wrapper = mount(Index)
    const selects = wrapper.findAll('select')

    // 생년월일 입력 (년/월/일 select - 처음 3개)
    await selects[0].setValue('1998') // 년
    await selects[1].setValue('6')    // 월
    await selects[2].setValue('15')   // 일
    await wrapper.find('select[name="income"]').setValue('0')
    await wrapper.find('select[name="region"]').setValue('서울')

    // 폼 제출
    const form = wrapper.find('form')
    await form.trigger('submit')

    // API 호출 대기
    await new Promise((resolve) => setTimeout(resolve, 100))

    // 검색 결과가 표시되어야 함
    const benefitCards = wrapper.findAllComponents({ name: 'BenefitCard' })
    expect(benefitCards.length).toBe(2)
  })

  it('모든 필수 폼 요소가 존재해야 한다', () => {
    const wrapper = mount(Index)

    // select 필드들과 버튼
    expect(wrapper.find('select[name="income"]').exists()).toBe(true)
    expect(wrapper.find('select[name="region"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })
})
