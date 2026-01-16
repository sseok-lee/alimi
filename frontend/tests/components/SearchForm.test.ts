import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchForm from '../../app/components/SearchForm.vue'

describe('SearchForm.vue', () => {
  // 테스트를 위해 날짜를 고정 (2026-01-15)
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-15'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('컴포넌트가 렌더링되어야 한다', () => {
    const wrapper = mount(SearchForm)
    expect(wrapper.exists()).toBe(true)
  })

  it('생년월일 선택 필드가 표시되어야 한다 (년/월/일 select)', () => {
    const wrapper = mount(SearchForm)
    const selects = wrapper.findAll('select')
    // 년, 월, 일, 소득, 지역, 카테고리, 지원유형 = 7개 (정렬은 결과 화면에서 처리)
    expect(selects.length).toBe(7)
    expect(wrapper.text()).toContain('생년월일')
    expect(wrapper.text()).toContain('년도')
    expect(wrapper.text()).toContain('월')
    expect(wrapper.text()).toContain('일')
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

  it('지원금 찾기 버튼이 표시되어야 한다', () => {
    const wrapper = mount(SearchForm)
    const button = wrapper.find('button[type="submit"]')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('지원금 찾기')
  })

  it('카테고리 필터가 표시되어야 한다', () => {
    const wrapper = mount(SearchForm)
    const categorySelect = wrapper.find('select[name="category"]')
    expect(categorySelect.exists()).toBe(true)
  })

  it('대상 조건 체크박스가 표시되어야 한다', () => {
    const wrapper = mount(SearchForm)
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    // 주요 대상 4개 + 추가 대상 6개 + 신청 조건 2개 = 12개
    expect(checkboxes.length).toBe(12)
  })

  it('생년월일 입력 시 만 나이가 계산되어 표시되어야 한다', async () => {
    const wrapper = mount(SearchForm)
    const selects = wrapper.findAll('select')

    // 년/월/일 select 찾기 (처음 3개)
    const yearSelect = selects[0]
    const monthSelect = selects[1]
    const daySelect = selects[2]

    // 1998-06-15 생년월일 입력 → 2026-01-15 기준 만 27세
    await yearSelect.setValue('1998')
    await monthSelect.setValue('6')
    await daySelect.setValue('15')

    // 만 나이 표시 확인
    expect(wrapper.text()).toContain('만 27세')
  })

  it('폼 입력 후 검색 버튼 클릭 시 submit 이벤트가 emit되어야 한다', async () => {
    const wrapper = mount(SearchForm)
    const selects = wrapper.findAll('select')

    // 생년월일 입력 (1998-06-15 → 만 27세)
    await selects[0].setValue('1998') // 년
    await selects[1].setValue('6')    // 월
    await selects[2].setValue('15')   // 일
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

    const button = wrapper.find('button[type="submit"]')
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
    expect(wrapper.text()).toContain('검색에 실패했습니다')
  })

  it('카테고리와 대상조건 필터가 emit에 포함되어야 한다', async () => {
    const wrapper = mount(SearchForm)
    const selects = wrapper.findAll('select')

    // 생년월일 입력 (1995-06-15 → 만 30세)
    await selects[0].setValue('1995') // 년
    await selects[1].setValue('6')    // 월
    await selects[2].setValue('15')   // 일
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
    expect(emittedParams.age).toBe(30)
    expect(emittedParams.category).toBe('생활안정')
    expect(emittedParams.lifePregnancy).toBe(true)
    expect(emittedParams.targetDisabled).toBe(true)
  })

  it('생일이 아직 안 지났으면 나이가 1살 적게 계산되어야 한다', async () => {
    const wrapper = mount(SearchForm)
    const selects = wrapper.findAll('select')

    // 1998-06-15 생년월일 입력 → 2026-01-15 기준 만 27세
    await selects[0].setValue('1998')
    await selects[1].setValue('6')
    await selects[2].setValue('15')
    expect(wrapper.text()).toContain('만 27세')

    // 1998-12-31 생년월일 입력 → 2026-01-15 기준 만 27세 (작년에 이미 생일 지남)
    await selects[0].setValue('1998')
    await selects[1].setValue('12')
    await selects[2].setValue('31')
    expect(wrapper.text()).toContain('만 27세')

    // 1999-02-01 생년월일 입력 → 2026-01-15 기준 만 26세 (아직 생일 안 지남)
    await selects[0].setValue('1999')
    await selects[1].setValue('2')
    await selects[2].setValue('1')
    expect(wrapper.text()).toContain('만 26세')
  })
})
