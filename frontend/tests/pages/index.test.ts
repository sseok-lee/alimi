import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Index from '../../app/pages/index.vue'

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

  it('"지원금 찾기" 버튼을 표시해야 한다', () => {
    const wrapper = mount(Index)
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('지원금 찾기')
  })

  it('버튼 클릭 시 /search 페이지로 이동해야 한다', async () => {
    const mockNavigateTo = vi.fn()
    global.navigateTo = mockNavigateTo

    const wrapper = mount(Index)

    // 폼 데이터 입력
    await wrapper.find('input[name="age"]').setValue('27')
    await wrapper.find('select[name="income"]').setValue('0')
    await wrapper.find('select[name="region"]').setValue('서울')

    // 폼 제출
    const form = wrapper.find('form')
    await form.trigger('submit')

    // navigateTo가 /search로 호출되었는지 확인
    expect(mockNavigateTo).toHaveBeenCalledWith('/search')
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
