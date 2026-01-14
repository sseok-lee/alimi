import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BenefitCard from '../../app/components/BenefitCard.vue'
import type { BenefitResponse } from '../../app/composables/useBenefitSearch'

// Mock 데이터 - 전체 정보가 있는 benefit
const mockBenefit: BenefitResponse = {
  id: 'benefit-001',
  name: '청년도약계좌',
  category: '금융지원',
  description: '5년간 매월 납입 시 정부기여금 지원',
  estimated_amount: '5년 후 5,000만원',
  eligibility: ['19~34세', '연소득 7,500만원 이하'],
  link: 'https://www.kinfa.or.kr/',
}

// Mock 데이터 - 최소 정보만 있는 benefit (description, estimated_amount 없음)
const mockBenefitMinimal: BenefitResponse = {
  id: 'benefit-002',
  name: '청년 월세 지원',
  category: '주거지원',
  eligibility: ['19~34세'],
  link: 'https://www.molit.go.kr/',
}

describe('BenefitCard.vue', () => {
  it('컴포넌트가 렌더링되어야 한다', () => {
    const wrapper = mount(BenefitCard, {
      props: {
        benefit: mockBenefit,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('benefit.name이 표시되어야 한다', () => {
    const wrapper = mount(BenefitCard, {
      props: {
        benefit: mockBenefit,
      },
    })
    expect(wrapper.text()).toContain('청년도약계좌')
  })

  it('benefit.category가 표시되어야 한다', () => {
    const wrapper = mount(BenefitCard, {
      props: {
        benefit: mockBenefit,
      },
    })
    expect(wrapper.text()).toContain('금융지원')
  })

  it('benefit.estimated_amount가 있으면 표시되어야 한다', () => {
    const wrapper = mount(BenefitCard, {
      props: {
        benefit: mockBenefit,
      },
    })
    expect(wrapper.text()).toContain('5년 후 5,000만원')
  })

  it('benefit.description이 있으면 표시되어야 한다', () => {
    const wrapper = mount(BenefitCard, {
      props: {
        benefit: mockBenefit,
      },
    })
    expect(wrapper.text()).toContain('5년간 매월 납입 시 정부기여금 지원')
  })

  it('benefit.eligibility 배열이 표시되어야 한다', () => {
    const wrapper = mount(BenefitCard, {
      props: {
        benefit: mockBenefit,
      },
    })
    expect(wrapper.text()).toContain('19~34세')
    expect(wrapper.text()).toContain('연소득 7,500만원 이하')
  })

  it('외부 링크 버튼이 표시되어야 한다', () => {
    const wrapper = mount(BenefitCard, {
      props: {
        benefit: mockBenefit,
      },
    })
    const linkButton = wrapper.find('a')
    expect(linkButton.exists()).toBe(true)
    expect(linkButton.text()).toContain('신청하기')
  })

  it('링크 버튼에 href 속성이 올바르게 설정되어야 한다', () => {
    const wrapper = mount(BenefitCard, {
      props: {
        benefit: mockBenefit,
      },
    })
    const linkButton = wrapper.find('a')
    expect(linkButton.attributes('href')).toBe('https://www.kinfa.or.kr/')
  })

  it('링크 버튼에 target="_blank" 속성이 설정되어야 한다', () => {
    const wrapper = mount(BenefitCard, {
      props: {
        benefit: mockBenefit,
      },
    })
    const linkButton = wrapper.find('a')
    expect(linkButton.attributes('target')).toBe('_blank')
  })

  it('링크 버튼에 rel="noopener noreferrer" 속성이 설정되어야 한다 (보안)', () => {
    const wrapper = mount(BenefitCard, {
      props: {
        benefit: mockBenefit,
      },
    })
    const linkButton = wrapper.find('a')
    expect(linkButton.attributes('rel')).toBe('noopener noreferrer')
  })

  it('estimated_amount가 없으면 표시되지 않아야 한다', () => {
    const wrapper = mount(BenefitCard, {
      props: {
        benefit: mockBenefitMinimal,
      },
    })
    const estimatedAmount = wrapper.find('.estimated-amount')
    expect(estimatedAmount.exists()).toBe(false)
  })

  it('description이 없으면 표시되지 않아야 한다', () => {
    const wrapper = mount(BenefitCard, {
      props: {
        benefit: mockBenefitMinimal,
      },
    })
    const description = wrapper.find('.description')
    expect(description.exists()).toBe(false)
  })
})
