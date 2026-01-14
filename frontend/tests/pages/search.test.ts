import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
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
  http.get('http://localhost:8000/api/v1/benefits/search', ({ request }) => {
    const url = new URL(request.url)
    const age = url.searchParams.get('age')
    const income = url.searchParams.get('income')
    const region = url.searchParams.get('region')

    if (!age || !income || !region) {
      return HttpResponse.json({ error: 'Missing parameters' }, { status: 422 })
    }

    // 빈 결과를 반환하도록 쿼리 파라미터 확인 (age=99는 테스트용)
    if (age === '99') {
      return HttpResponse.json([])
    }

    return HttpResponse.json(mockBenefits)
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('search.vue', () => {
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
    const wrapper = mount(SearchPage)
    const searchForm = wrapper.findComponent({ name: 'SearchForm' })

    // 검색 폼에서 입력 및 제출
    await searchForm.find('input[name="age"]').setValue('27')
    await searchForm.find('select[name="income"]').setValue('0')
    await searchForm.find('select[name="region"]').setValue('서울')
    await searchForm.find('form').trigger('submit')

    // API 호출 대기
    await new Promise((resolve) => setTimeout(resolve, 100))

    // BenefitCard가 렌더링되었는지 확인
    const benefitCards = wrapper.findAllComponents({ name: 'BenefitCard' })
    expect(benefitCards.length).toBe(2)
  })

  it('결과가 2개면 2개의 카드가 표시되어야 한다', async () => {
    const wrapper = mount(SearchPage)
    const searchForm = wrapper.findComponent({ name: 'SearchForm' })

    await searchForm.find('input[name="age"]').setValue('27')
    await searchForm.find('select[name="income"]').setValue('0')
    await searchForm.find('select[name="region"]').setValue('서울')
    await searchForm.find('form').trigger('submit')

    await new Promise((resolve) => setTimeout(resolve, 100))

    const benefitCards = wrapper.findAllComponents({ name: 'BenefitCard' })
    expect(benefitCards.length).toBe(mockBenefits.length)
  })

  it('검색 결과가 0개면 "결과 없음" 메시지가 표시되어야 한다', async () => {
    const wrapper = mount(SearchPage)
    const searchForm = wrapper.findComponent({ name: 'SearchForm' })

    // 빈 결과를 받기 위해 age=99 사용 (Mock 서버에서 빈 배열 반환)
    await searchForm.find('input[name="age"]').setValue('99')
    await searchForm.find('select[name="income"]').setValue('0')
    await searchForm.find('select[name="region"]').setValue('서울')
    await searchForm.find('form').trigger('submit')

    await new Promise((resolve) => setTimeout(resolve, 100))

    // "결과 없음" 메시지 확인
    expect(wrapper.text()).toContain('검색 결과가 없습니다')
  })

  it('에러 발생 시 에러 메시지가 표시되어야 한다', async () => {
    // 에러를 반환하도록 Mock 재설정
    server.use(
      http.get('http://localhost:8000/api/v1/benefits/search', () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 })
      }),
    )

    const wrapper = mount(SearchPage)
    const searchForm = wrapper.findComponent({ name: 'SearchForm' })

    await searchForm.find('input[name="age"]').setValue('27')
    await searchForm.find('select[name="income"]').setValue('0')
    await searchForm.find('select[name="region"]').setValue('서울')
    await searchForm.find('form').trigger('submit')

    await new Promise((resolve) => setTimeout(resolve, 100))

    // 에러 메시지가 표시되어야 함 (SearchForm 내부에 표시됨)
    const errorMessage = wrapper.find('.error-message')
    expect(errorMessage.exists()).toBe(true)
  })

  it('검색 결과 개수가 표시되어야 한다', async () => {
    const wrapper = mount(SearchPage)
    const searchForm = wrapper.findComponent({ name: 'SearchForm' })

    await searchForm.find('input[name="age"]').setValue('27')
    await searchForm.find('select[name="income"]').setValue('0')
    await searchForm.find('select[name="region"]').setValue('서울')
    await searchForm.find('form').trigger('submit')

    await new Promise((resolve) => setTimeout(resolve, 100))

    // "총 X개의 지원금을 찾았습니다" 메시지 확인
    expect(wrapper.text()).toContain('총')
    expect(wrapper.text()).toContain('개의 지원금을 찾았습니다')
  })

  it('반응형 그리드가 적용되어야 한다', async () => {
    const wrapper = mount(SearchPage)
    const searchForm = wrapper.findComponent({ name: 'SearchForm' })

    await searchForm.find('input[name="age"]').setValue('27')
    await searchForm.find('select[name="income"]').setValue('0')
    await searchForm.find('select[name="region"]').setValue('서울')
    await searchForm.find('form').trigger('submit')

    await new Promise((resolve) => setTimeout(resolve, 100))

    // 그리드 컨테이너 클래스 확인
    const gridContainer = wrapper.find('.grid')
    expect(gridContainer.exists()).toBe(true)
    expect(gridContainer.classes()).toContain('md:grid-cols-2')
    expect(gridContainer.classes()).toContain('lg:grid-cols-3')
  })
})
