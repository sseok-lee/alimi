import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MobileBottomBar from '../../../app/components/benefit/MobileBottomBar.vue'

describe('MobileBottomBar.vue', () => {
  it('컴포넌트가 렌더링되어야 한다', () => {
    const wrapper = mount(MobileBottomBar, {
      props: {
        link: 'https://www.gov.kr',
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('신청 버튼이 표시되어야 한다', () => {
    const wrapper = mount(MobileBottomBar, {
      props: {
        link: 'https://www.gov.kr',
      },
    })
    const button = wrapper.find('a')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('신청')
  })

  it('링크가 올바르게 설정되어야 한다', () => {
    const wrapper = mount(MobileBottomBar, {
      props: {
        link: 'https://www.gov.kr',
      },
    })
    const button = wrapper.find('a')
    expect(button.attributes('href')).toBe('https://www.gov.kr')
  })

  it('target="_blank"가 설정되어야 한다', () => {
    const wrapper = mount(MobileBottomBar, {
      props: {
        link: 'https://www.gov.kr',
      },
    })
    const button = wrapper.find('a')
    expect(button.attributes('target')).toBe('_blank')
  })

  it('fixed 클래스가 적용되어야 한다', () => {
    const wrapper = mount(MobileBottomBar, {
      props: {
        link: 'https://www.gov.kr',
      },
    })
    expect(wrapper.classes()).toContain('fixed')
  })

  it('bottom-0 클래스가 적용되어야 한다', () => {
    const wrapper = mount(MobileBottomBar, {
      props: {
        link: 'https://www.gov.kr',
      },
    })
    expect(wrapper.classes()).toContain('bottom-0')
  })

  it('lg:hidden 클래스가 적용되어야 한다 (모바일 전용)', () => {
    const wrapper = mount(MobileBottomBar, {
      props: {
        link: 'https://www.gov.kr',
      },
    })
    expect(wrapper.classes()).toContain('lg:hidden')
  })
})
