import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchForm from '../../app/components/SearchForm.vue'

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

  it('폼 입력 후 검색 버튼 클릭 시 submit 이벤트가 emit되어야 한다', async () => {
    const wrapper = mount(SearchForm)

    // 폼 입력
    await wrapper.find('input[name="age"]').setValue('27')
    await wrapper.find('select[name="income"]').setValue('0')
    await wrapper.find('select[name="region"]').setValue('서울')

    // 폼 제출
    await wrapper.find('form').trigger('submit')

    // submit 이벤트가 emit되었는지 확인
    expect(wrapper.emitted('submit')).toBeTruthy()
    const emittedParams = wrapper.emitted('submit')![0][0] as {
      age: number
      income: number
      region: string
    }
    expect(emittedParams.age).toBe(27)
    expect(emittedParams.income).toBe(0)
    expect(emittedParams.region).toBe('서울')
  })

  it('필수 필드가 비어있으면 검색이 동작하지 않아야 한다', async () => {
    const wrapper = mount(SearchForm)

    // 빈 폼으로 제출 시도
    await wrapper.find('form').trigger('submit')

    // submit 이벤트가 emit되지 않아야 함
    expect(wrapper.emitted('submit')).toBeFalsy()
  })

  it('loading prop이 true면 로딩 상태가 표시되어야 한다', () => {
    const wrapper = mount(SearchForm, {
      props: {
        loading: true,
      },
    })

    // 로딩 클래스가 있어야 함
    const button = wrapper.find('button[type="submit"]')
    expect(button.classes()).toContain('loading')
    expect(button.text()).toContain('검색 중')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('error prop이 있으면 에러 메시지가 표시되어야 한다', () => {
    const wrapper = mount(SearchForm, {
      props: {
        error: '검색에 실패했습니다',
      },
    })

    // 에러 메시지가 표시되어야 함
    const errorMessage = wrapper.find('.error-message')
    expect(errorMessage.exists()).toBe(true)
    expect(errorMessage.text()).toContain('검색에 실패했습니다')
  })

  it('카테고리와 대상조건 필터가 emit에 포함되어야 한다', async () => {
    const wrapper = mount(SearchForm)

    // 폼 입력
    await wrapper.find('input[name="age"]').setValue('30')
    await wrapper.find('select[name="income"]').setValue('40000000')
    await wrapper.find('select[name="region"]').setValue('경기')
    await wrapper.find('select[name="category"]').setValue('생활안정')

    // 체크박스 선택
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    await checkboxes[0].setValue(true) // 임신/출산
    await checkboxes[1].setValue(true) // 장애인

    // 폼 제출
    await wrapper.find('form').trigger('submit')

    // submit 이벤트 확인
    const emittedParams = wrapper.emitted('submit')![0][0] as {
      age: number
      income: number
      region: string
      category?: string
      lifePregnancy?: boolean
      targetDisabled?: boolean
    }
    expect(emittedParams.category).toBe('생활안정')
    expect(emittedParams.lifePregnancy).toBe(true)
    expect(emittedParams.targetDisabled).toBe(true)
  })
})
