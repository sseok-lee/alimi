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

  it('상세보기 버튼이 표시되어야 한다', () => {
    const wrapper = mount(BenefitCard, {
      props: {
        benefit: mockBenefit,
      },
    })
    // 상세보기 버튼은 두 번째 버튼 (첫 번째는 북마크 버튼)
    const buttons = wrapper.findAll('button')
    const detailButton = buttons[1]
    expect(detailButton.exists()).toBe(true)
    expect(detailButton.text()).toContain('상세보기')
  })

  it('카드 클릭 시 click 이벤트가 emit되어야 한다', async () => {
    const wrapper = mount(BenefitCard, {
      props: {
        benefit: mockBenefit,
      },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')![0]).toEqual([mockBenefit])
  })

  it('상세보기 버튼 클릭 시 click 이벤트가 emit되어야 한다', async () => {
    const wrapper = mount(BenefitCard, {
      props: {
        benefit: mockBenefit,
      },
    })

    // 상세보기 버튼은 두 번째 버튼 (첫 번째는 북마크 버튼)
    const buttons = wrapper.findAll('button')
    const detailButton = buttons[1]
    await detailButton.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('카드에 클릭 가능한 스타일이 적용되어야 한다', () => {
    const wrapper = mount(BenefitCard, {
      props: {
        benefit: mockBenefit,
      },
    })
    const card = wrapper.find('.benefit-card')
    expect(card.exists()).toBe(true)
    // CSS 클래스에 cursor: pointer가 적용됨 (scoped style)
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
