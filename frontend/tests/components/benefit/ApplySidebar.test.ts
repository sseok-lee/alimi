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
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('신청 마감일이 표시되어야 한다', () => {
    const wrapper = mount(ApplySidebar, {
      props: {
        applicationDeadline: '2024-12-31',
        link: 'https://www.gov.kr',
        organizationName: null,
      },
    })
    expect(wrapper.text()).toContain('신청 마감')
  })

  it('D-Day가 계산되어 표시되어야 한다', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 5)
    const dateString = futureDate.toISOString().split('T')[0]

    const wrapper = mount(ApplySidebar, {
      props: {
        applicationDeadline: dateString,
        link: 'https://www.gov.kr',
        organizationName: null,
      },
    })
    expect(wrapper.text()).toContain('D-')
  })

  it('신청 버튼이 표시되어야 한다', () => {
    const wrapper = mount(ApplySidebar, {
      props: {
        applicationDeadline: null,
        link: 'https://www.gov.kr',
        organizationName: null,
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
      },
    })
    expect(wrapper.text()).toContain('서울시청')
  })
})
