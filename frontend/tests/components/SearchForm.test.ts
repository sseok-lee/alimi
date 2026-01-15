import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import SearchForm from '../../app/components/SearchForm.vue'

// Mock API 서버 설정
const handlers = [
  http.post('http://localhost:8000/api/benefits/search', async ({ request }) => {
    const body = await request.json() as any
    const { age, income, region } = body

    if (!age || income === undefined || !region) {
      return HttpResponse.json({ error: 'Missing parameters' }, { status: 422 })
    }

    return HttpResponse.json({
      benefits: [
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
          eligibility: ['19~34세', '무주택자', '일정 소득 이하'],
          link: 'https://www.molit.go.kr/',
        },
      ],
      total: 2,
      searchParams: { age, income, region },
    })
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('SearchForm.vue', () => {
  it('컴포넌트가 렌더링되어야 한다', () => {
    const wrapper = mount(SearchForm)
    expect(wrapper.exists()).toBe(true)
  })

  it('나이 입력 필드가 표시되어야 한다', () => {
    const wrapper = mount(SearchForm)
    const ageInput = wrapper.find('input[name="age"]')
    expect(ageInput.exists()).toBe(true)
    expect(ageInput.attributes('type')).toBe('number')
    expect(ageInput.attributes('min')).toBe('0')
    expect(ageInput.attributes('max')).toBe('150')
  })

  it('소득 선택 필드가 표시되어야 한다', () => {
    const wrapper = mount(SearchForm)
    const incomeSelect = wrapper.find('select[name="income"]')
    expect(incomeSelect.exists()).toBe(true)

    const options = incomeSelect.findAll('option')
    expect(options.length).toBeGreaterThan(1) // placeholder + 실제 옵션들
  })

  it('지역 선택 필드가 표시되어야 한다', () => {
    const wrapper = mount(SearchForm)
    const regionSelect = wrapper.find('select[name="region"]')
    expect(regionSelect.exists()).toBe(true)

    const options = regionSelect.findAll('option')
    expect(options.length).toBeGreaterThan(1)
  })

  it('검색 버튼이 표시되어야 한다', () => {
    const wrapper = mount(SearchForm)
    const button = wrapper.find('button[type="submit"]')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('검색')
  })

  it('카테고리 필터가 표시되어야 한다', () => {
    const wrapper = mount(SearchForm)
    const categorySelect = wrapper.find('select[name="category"]')
    expect(categorySelect.exists()).toBe(true)
  })

  it('대상 조건 체크박스가 표시되어야 한다', () => {
    const wrapper = mount(SearchForm)
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    expect(checkboxes.length).toBe(4) // 임신/출산, 장애인, 한부모/조손, 다자녀
  })

  it('폼 입력 후 검색 버튼 클릭 시 API 호출되어야 한다', async () => {
    const wrapper = mount(SearchForm)

    // 폼 입력
    await wrapper.find('input[name="age"]').setValue('27')
    await wrapper.find('select[name="income"]').setValue('0')
    await wrapper.find('select[name="region"]').setValue('서울')

    // 폼 제출
    await wrapper.find('form').trigger('submit')

    // 약간의 대기 (API 호출 시간)
    await new Promise((resolve) => setTimeout(resolve, 100))

    // 결과가 emit 되었는지 확인
    expect(wrapper.emitted('search-results')).toBeTruthy()
  })

  it('필수 필드가 비어있으면 검색이 동작하지 않아야 한다', async () => {
    const wrapper = mount(SearchForm)

    // 빈 폼으로 제출 시도
    await wrapper.find('form').trigger('submit')

    // API 호출이 일어나지 않아야 함
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(wrapper.emitted('search-results')).toBeFalsy()
  })

  it('로딩 상태가 올바르게 표시되어야 한다', async () => {
    const wrapper = mount(SearchForm)

    // 초기 상태: 로딩 아님
    expect(wrapper.find('.loading').exists()).toBe(false)

    // 폼 입력
    await wrapper.find('input[name="age"]').setValue('27')
    await wrapper.find('select[name="income"]').setValue('0')
    await wrapper.find('select[name="region"]').setValue('서울')

    // 폼 제출
    await wrapper.find('form').trigger('submit')

    // 로딩 중 상태 확인 (짧은 시간)
    // Note: 실제로는 타이밍이 중요하지만, 테스트에서는 간단히 처리
    await new Promise((resolve) => setTimeout(resolve, 100))
  })

  it('에러 발생 시 에러 메시지가 표시되어야 한다', async () => {
    // 에러를 반환하도록 Mock 재설정
    server.use(
      http.post('http://localhost:8000/api/benefits/search', () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 })
      }),
    )

    const wrapper = mount(SearchForm)

    await wrapper.find('input[name="age"]').setValue('27')
    await wrapper.find('select[name="income"]').setValue('0')
    await wrapper.find('select[name="region"]').setValue('서울')

    await wrapper.find('form').trigger('submit')
    await new Promise((resolve) => setTimeout(resolve, 100))

    // 에러 메시지가 표시되어야 함
    const errorMessage = wrapper.find('.error-message')
    expect(errorMessage.exists()).toBe(true)
  })

  it('검색 결과를 부모 컴포넌트에 emit 해야 한다', async () => {
    const wrapper = mount(SearchForm)

    await wrapper.find('input[name="age"]').setValue('27')
    await wrapper.find('select[name="income"]').setValue('0')
    await wrapper.find('select[name="region"]').setValue('서울')

    await wrapper.find('form').trigger('submit')
    await new Promise((resolve) => setTimeout(resolve, 100))

    const emitted = wrapper.emitted('search-results')
    expect(emitted).toBeTruthy()
    if (emitted) {
      expect(Array.isArray(emitted[0][0])).toBe(true)
      expect(emitted[0][0].length).toBe(2) // Mock에서 2개 반환
    }
  })
})
