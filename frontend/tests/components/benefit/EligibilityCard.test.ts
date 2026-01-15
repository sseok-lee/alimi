import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EligibilityCard from '../../../app/components/benefit/EligibilityCard.vue'

describe('EligibilityCard.vue', () => {
  it('컴포넌트가 렌더링되어야 한다', () => {
    const wrapper = mount(EligibilityCard, {
      props: {
        targetAudience: '만 19~39세',
        selectionCriteria: '소득 100% 이하',
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('헤더 제목이 표시되어야 한다', () => {
    const wrapper = mount(EligibilityCard, {
      props: {
        targetAudience: '만 19~39세',
        selectionCriteria: null,
      },
    })
    expect(wrapper.text()).toContain('자격 요건')
  })

  it('대상자 정보가 표시되어야 한다', () => {
    const wrapper = mount(EligibilityCard, {
      props: {
        targetAudience: '만 19~39세',
        selectionCriteria: null,
      },
    })
    expect(wrapper.text()).toContain('만 19~39세')
  })

  it('선발 기준이 표시되어야 한다', () => {
    const wrapper = mount(EligibilityCard, {
      props: {
        targetAudience: null,
        selectionCriteria: '소득 100% 이하',
      },
    })
    expect(wrapper.text()).toContain('소득 100% 이하')
  })

  it('targetAudience가 null이면 표시되지 않아야 한다', () => {
    const wrapper = mount(EligibilityCard, {
      props: {
        targetAudience: null,
        selectionCriteria: '소득 100% 이하',
      },
    })
    expect(wrapper.text()).not.toContain('만 19~39세')
  })

  it('selectionCriteria가 null이면 표시되지 않아야 한다', () => {
    const wrapper = mount(EligibilityCard, {
      props: {
        targetAudience: '만 19~39세',
        selectionCriteria: null,
      },
    })
    expect(wrapper.text()).not.toContain('소득 100% 이하')
  })

  it('둘 다 null이면 빈 상태 메시지가 표시되어야 한다', () => {
    const wrapper = mount(EligibilityCard, {
      props: {
        targetAudience: null,
        selectionCriteria: null,
      },
    })
    expect(wrapper.text()).toContain('자격 요건 정보가 없습니다')
  })
})
