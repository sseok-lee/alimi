import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RelatedBenefits from '../../../app/components/benefit/RelatedBenefits.vue'

const mockBenefits = [
  {
    id: 'b1',
    name: '청년 전세자금 대출',
    category: '금융지원',
    description: '전세 자금 대출 이자 최대 3% 지원',
    link: 'https://example.com/1',
    viewCount: 1500,
  },
  {
    id: 'b2',
    name: '취업성공패키지',
    category: '고용지원',
    description: '취업을 위한 종합 지원 프로그램',
    link: 'https://example.com/2',
    viewCount: 2000,
  },
  {
    id: 'b3',
    name: '청년 정신건강 상담',
    category: '건강지원',
    description: '무료 전문 상담 서비스',
    link: 'https://example.com/3',
    viewCount: 800,
  },
]

describe('RelatedBenefits.vue', () => {
  it('컴포넌트가 렌더링되어야 한다', () => {
    const wrapper = mount(RelatedBenefits, {
      props: { benefits: mockBenefits },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('섹션 제목이 표시되어야 한다', () => {
    const wrapper = mount(RelatedBenefits, {
      props: { benefits: mockBenefits },
    })
    expect(wrapper.text()).toContain('관련 서비스')
  })

  it('전달된 benefit 카드들이 모두 렌더링되어야 한다', () => {
    const wrapper = mount(RelatedBenefits, {
      props: { benefits: mockBenefits },
    })
    expect(wrapper.text()).toContain('청년 전세자금 대출')
    expect(wrapper.text()).toContain('취업성공패키지')
    expect(wrapper.text()).toContain('청년 정신건강 상담')
  })

  it('각 카드에 카테고리가 표시되어야 한다', () => {
    const wrapper = mount(RelatedBenefits, {
      props: { benefits: mockBenefits },
    })
    expect(wrapper.text()).toContain('금융지원')
    expect(wrapper.text()).toContain('고용지원')
    expect(wrapper.text()).toContain('건강지원')
  })

  it('각 카드에 설명이 표시되어야 한다', () => {
    const wrapper = mount(RelatedBenefits, {
      props: { benefits: mockBenefits },
    })
    expect(wrapper.text()).toContain('전세 자금 대출 이자')
    expect(wrapper.text()).toContain('종합 지원 프로그램')
  })

  it('각 카드에 링크가 설정되어야 한다', () => {
    const wrapper = mount(RelatedBenefits, {
      props: { benefits: mockBenefits },
    })
    const links = wrapper.findAll('a')
    expect(links.length).toBeGreaterThan(0)
  })

  it('benefits 배열이 비어있으면 빈 상태 메시지가 표시되어야 한다', () => {
    const wrapper = mount(RelatedBenefits, {
      props: { benefits: [] },
    })
    expect(wrapper.text()).toContain('관련 서비스가 없습니다')
  })
})
