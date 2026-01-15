import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DocumentsCard from '../../../app/components/benefit/DocumentsCard.vue'

describe('DocumentsCard.vue', () => {
  it('컴포넌트가 렌더링되어야 한다', () => {
    const wrapper = mount(DocumentsCard, {
      props: {
        documents: '임대차 계약서\n가족관계증명서',
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('헤더 제목이 표시되어야 한다', () => {
    const wrapper = mount(DocumentsCard, {
      props: {
        documents: '임대차 계약서',
      },
    })
    expect(wrapper.text()).toContain('구비 서류')
  })

  it('줄바꿈으로 구분된 서류 목록이 표시되어야 한다', () => {
    const wrapper = mount(DocumentsCard, {
      props: {
        documents: '임대차 계약서\n가족관계증명서\n통장 사본',
      },
    })
    expect(wrapper.text()).toContain('임대차 계약서')
    expect(wrapper.text()).toContain('가족관계증명서')
    expect(wrapper.text()).toContain('통장 사본')
  })

  it('documents가 null이면 빈 상태 메시지가 표시되어야 한다', () => {
    const wrapper = mount(DocumentsCard, {
      props: {
        documents: null,
      },
    })
    expect(wrapper.text()).toContain('구비 서류 정보가 없습니다')
  })

  it('documents가 빈 문자열이면 빈 상태 메시지가 표시되어야 한다', () => {
    const wrapper = mount(DocumentsCard, {
      props: {
        documents: '',
      },
    })
    expect(wrapper.text()).toContain('구비 서류 정보가 없습니다')
  })
})
