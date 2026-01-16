import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BenefitHero from '../../../app/components/benefit/BenefitHero.vue'

const mockBenefit = {
  name: '청년 월세 지원',
  category: '주거지원',
  description: '서울 거주 청년의 주거 안정을 위해 월 최대 200,000원을 12개월간 지원',
  supportDetails: '월 최대 200,000원',
  viewCount: 2405,
  supportType: null,
}

describe('BenefitHero.vue', () => {
  it('컴포넌트가 렌더링되어야 한다', () => {
    const wrapper = mount(BenefitHero, {
      props: { benefit: mockBenefit },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('카테고리 배지가 표시되어야 한다', () => {
    const wrapper = mount(BenefitHero, {
      props: { benefit: mockBenefit },
    })
    expect(wrapper.text()).toContain('주거지원')
  })

  it('서비스명(제목)이 표시되어야 한다', () => {
    const wrapper = mount(BenefitHero, {
      props: { benefit: mockBenefit },
    })
    expect(wrapper.text()).toContain('청년 월세 지원')
  })

  it('설명이 표시되어야 한다', () => {
    const wrapper = mount(BenefitHero, {
      props: { benefit: mockBenefit },
    })
    expect(wrapper.text()).toContain('서울 거주 청년의 주거 안정')
  })

  it('지원 금액이 표시되어야 한다', () => {
    const wrapper = mount(BenefitHero, {
      props: { benefit: mockBenefit },
    })
    expect(wrapper.text()).toContain('200,000원')
  })

  it('조회수가 표시되어야 한다', () => {
    const wrapper = mount(BenefitHero, {
      props: { benefit: mockBenefit },
    })
    expect(wrapper.text()).toContain('2,405')
  })

  it('description이 null이면 표시되지 않아야 한다', () => {
    const wrapper = mount(BenefitHero, {
      props: {
        benefit: { ...mockBenefit, description: null },
      },
    })
    const description = wrapper.find('.description')
    expect(description.exists()).toBe(false)
  })
})
