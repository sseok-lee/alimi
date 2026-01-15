import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
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
  it('페이지 타이틀 "맞춤형 지원금 찾기"를 표시해야 한다', () => {
    const wrapper = mount(Index)
    expect(wrapper.text()).toContain('맞춤형 지원금 찾기')
  })

  it('나이 입력 필드를 표시해야 한다', () => {
    const wrapper = mount(Index)
    const ageInput = wrapper.find('input[name="age"]')
    expect(ageInput.exists()).toBe(true)
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

  it('"검색하기" 버튼을 표시해야 한다', () => {
    const wrapper = mount(Index)
    const button = wrapper.find('button[type="submit"]')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('검색하기')
  })

  it('폼 제출 시 검색 결과를 표시해야 한다', async () => {
    const wrapper = mount(Index)

    // 폼 데이터 입력
    await wrapper.find('input[name="age"]').setValue('27')
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

    // 3개의 입력 필드와 1개의 버튼
    expect(wrapper.find('input[name="age"]').exists()).toBe(true)
    expect(wrapper.find('select[name="income"]').exists()).toBe(true)
    expect(wrapper.find('select[name="region"]').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })
})
