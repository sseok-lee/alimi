import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProcessSteps from '../../../app/components/benefit/ProcessSteps.vue'

describe('ProcessSteps.vue', () => {
  it('컴포넌트가 렌더링되어야 한다', () => {
    const wrapper = mount(ProcessSteps, {
      props: {
        applicationMethod: '1. 정부 웹사이트 방문\n2. 신청서 작성\n3. 서류 제출',
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('헤더 제목이 표시되어야 한다', () => {
    const wrapper = mount(ProcessSteps, {
      props: {
        applicationMethod: '1. 정부 웹사이트 방문',
      },
    })
    expect(wrapper.text()).toContain('신청 방법')
  })

  it('줄바꿈으로 구분된 단계들이 표시되어야 한다', () => {
    const wrapper = mount(ProcessSteps, {
      props: {
        applicationMethod: '1. 정부 웹사이트 방문\n2. 신청서 작성\n3. 서류 제출',
      },
    })
    expect(wrapper.text()).toContain('정부 웹사이트 방문')
    expect(wrapper.text()).toContain('신청서 작성')
    expect(wrapper.text()).toContain('서류 제출')
  })

  it('단계 번호 배지가 표시되어야 한다', () => {
    const wrapper = mount(ProcessSteps, {
      props: {
        applicationMethod: '1. 정부 웹사이트 방문\n2. 신청서 작성',
      },
    })
    const badges = wrapper.findAll('.step-badge')
    expect(badges.length).toBeGreaterThan(0)
  })

  it('applicationMethod가 null이면 빈 상태 메시지가 표시되어야 한다', () => {
    const wrapper = mount(ProcessSteps, {
      props: {
        applicationMethod: null,
      },
    })
    expect(wrapper.text()).toContain('신청 방법 정보가 없습니다')
  })

  it('applicationMethod가 빈 문자열이면 빈 상태 메시지가 표시되어야 한다', () => {
    const wrapper = mount(ProcessSteps, {
      props: {
        applicationMethod: '',
      },
    })
    expect(wrapper.text()).toContain('신청 방법 정보가 없습니다')
  })
})
