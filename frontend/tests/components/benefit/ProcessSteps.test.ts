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

  it('신청 방법이 태그로 표시되어야 한다', () => {
    const wrapper = mount(ProcessSteps, {
      props: {
        applicationMethod: '1. 정부 웹사이트 방문\n2. 신청서 작성',
      },
    })
    const tags = wrapper.findAll('.method-tag')
    expect(tags.length).toBeGreaterThan(0)
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

  it('|| 구분자로 된 신청 방법이 분리되어 표시되어야 한다', () => {
    const wrapper = mount(ProcessSteps, {
      props: {
        applicationMethod: '온라인신청||방문신청||우편신청',
      },
    })
    expect(wrapper.text()).toContain('온라인신청')
    expect(wrapper.text()).toContain('방문신청')
    expect(wrapper.text()).toContain('우편신청')
  })

  it('"기타" 접두어가 제거되어야 한다', () => {
    const wrapper = mount(ProcessSteps, {
      props: {
        applicationMethod: '기타 온라인신청||방문신청',
      },
    })
    expect(wrapper.text()).toContain('온라인신청')
    expect(wrapper.text()).toContain('방문신청')
    expect(wrapper.text()).not.toContain('기타')
  })

  it('1개일 때도 태그로 표시되어야 한다', () => {
    const wrapper = mount(ProcessSteps, {
      props: {
        applicationMethod: '온라인신청',
      },
    })
    // 태그 확인
    const tags = wrapper.findAll('.method-tag')
    expect(tags.length).toBe(1)
    // 체크 아이콘 확인
    expect(wrapper.text()).toContain('check_circle')
  })

  it('2개 이상일 때도 동일한 태그 스타일로 표시되어야 한다', () => {
    const wrapper = mount(ProcessSteps, {
      props: {
        applicationMethod: '온라인신청||방문신청',
      },
    })
    // 태그 확인
    const tags = wrapper.findAll('.method-tag')
    expect(tags.length).toBe(2)
  })
})
