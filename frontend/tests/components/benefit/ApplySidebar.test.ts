import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ApplySidebar from '../../../app/components/benefit/ApplySidebar.vue'

describe('ApplySidebar.vue', () => {
  it('컴포넌트가 렌더링되어야 한다', () => {
    const wrapper = mount(ApplySidebar, {
      props: {
        applicationDeadline: '2024-12-31',
        link: 'https://www.gov.kr',
        organizationName: '서울시청',
        applyAgency: null,
        contactInfo: null,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('신청 기간이 표시되어야 한다', () => {
    const wrapper = mount(ApplySidebar, {
      props: {
        applicationDeadline: '2024-12-31',
        link: 'https://www.gov.kr',
        organizationName: null,
        applyAgency: null,
        contactInfo: null,
      },
    })
    expect(wrapper.text()).toContain('신청 기간')
  })

  it('기간형 신청 기간에 D-Day가 계산되어 표시되어야 한다', () => {
    const today = new Date()
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)
    // 기간형 형식으로 변경 (시작일~종료일)
    const startStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`
    const endStr = `${futureDate.getFullYear()}.${String(futureDate.getMonth() + 1).padStart(2, '0')}.${String(futureDate.getDate()).padStart(2, '0')}`
    const dateRange = `${startStr}~${endStr}`

    const wrapper = mount(ApplySidebar, {
      props: {
        applicationDeadline: dateRange,
        link: 'https://www.gov.kr',
        organizationName: null,
        applyAgency: null,
        contactInfo: null,
      },
    })
    expect(wrapper.text()).toContain('D-')
  })

  it('상시형 신청 기간이 배지로 표시되어야 한다', () => {
    const wrapper = mount(ApplySidebar, {
      props: {
        applicationDeadline: '상시',
        link: 'https://www.gov.kr',
        organizationName: null,
        applyAgency: null,
        contactInfo: null,
      },
    })
    expect(wrapper.text()).toContain('상시 신청')
  })

  it('예산 소진형이 선착순 배지로 표시되어야 한다', () => {
    const wrapper = mount(ApplySidebar, {
      props: {
        applicationDeadline: '2025.01.01 ~ 예산 소진 시까지',
        link: 'https://www.gov.kr',
        organizationName: null,
        applyAgency: null,
        contactInfo: null,
      },
    })
    expect(wrapper.text()).toContain('선착순')
  })

  it('신청 버튼이 표시되어야 한다', () => {
    const wrapper = mount(ApplySidebar, {
      props: {
        applicationDeadline: null,
        link: 'https://www.gov.kr',
        organizationName: null,
        applyAgency: null,
        contactInfo: null,
      },
    })
    const button = wrapper.find('a.apply-button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('신청하기')
  })

  it('신청 버튼에 링크가 올바르게 설정되어야 한다', () => {
    const wrapper = mount(ApplySidebar, {
      props: {
        applicationDeadline: null,
        link: 'https://www.gov.kr',
        organizationName: null,
        applyAgency: null,
        contactInfo: null,
      },
    })
    const button = wrapper.find('a.apply-button')
    expect(button.attributes('href')).toBe('https://www.gov.kr')
  })

  it('신청 버튼에 target="_blank"가 설정되어야 한다', () => {
    const wrapper = mount(ApplySidebar, {
      props: {
        applicationDeadline: null,
        link: 'https://www.gov.kr',
        organizationName: null,
        applyAgency: null,
        contactInfo: null,
      },
    })
    const button = wrapper.find('a.apply-button')
    expect(button.attributes('target')).toBe('_blank')
  })

  it('sticky 클래스가 적용되어야 한다', () => {
    const wrapper = mount(ApplySidebar, {
      props: {
        applicationDeadline: null,
        link: 'https://www.gov.kr',
        organizationName: null,
        applyAgency: null,
        contactInfo: null,
      },
    })
    expect(wrapper.classes()).toContain('sticky')
  })

  it('기관명이 있으면 표시되어야 한다', () => {
    const wrapper = mount(ApplySidebar, {
      props: {
        applicationDeadline: null,
        link: 'https://www.gov.kr',
        organizationName: '서울시청',
        applyAgency: null,
        contactInfo: null,
      },
    })
    expect(wrapper.text()).toContain('서울시청')
  })
})
