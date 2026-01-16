import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RelatedLawsCard from '../../../app/components/benefit/RelatedLawsCard.vue'

describe('RelatedLawsCard.vue', () => {
  it('컴포넌트가 렌더링되어야 한다', () => {
    const wrapper = mount(RelatedLawsCard, {
      props: {
        relatedLaws: '청년기본법 제10조\n주거기본법 제5조',
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('헤더 제목이 표시되어야 한다', () => {
    const wrapper = mount(RelatedLawsCard, {
      props: {
        relatedLaws: '청년기본법 제10조',
      },
    })
    expect(wrapper.text()).toContain('관련 법령')
  })

  it('초기 상태에서는 내용이 접혀 있어야 한다', () => {
    const wrapper = mount(RelatedLawsCard, {
      props: {
        relatedLaws: '청년기본법 제10조',
      },
    })
    // v-show를 사용하므로 style.display를 확인
    const content = wrapper.find('div.p-4')
    expect(content.attributes('style')).toContain('display: none')
  })

  it('헤더 클릭 시 내용이 펼쳐져야 한다', async () => {
    const wrapper = mount(RelatedLawsCard, {
      props: {
        relatedLaws: '청년기본법 제10조',
      },
    })

    // 초기 상태 확인
    let content = wrapper.find('div.p-4')
    expect(content.attributes('style')).toContain('display: none')

    // 헤더 클릭
    const header = wrapper.find('[class*="cursor-pointer"]')
    await header.trigger('click')

    // 펼쳐진 상태 확인 (style이 없거나 display: none이 아님)
    content = wrapper.find('div.p-4')
    const style = content.attributes('style') || ''
    expect(style).not.toContain('display: none')
  })

  it('줄바꿈으로 구분된 법령 목록이 표시되어야 한다', async () => {
    const wrapper = mount(RelatedLawsCard, {
      props: {
        relatedLaws: '청년기본법 제10조\n주거기본법 제5조\n사회보장기본법 제3조',
      },
    })

    // 헤더 클릭하여 펼치기
    const header = wrapper.find('[class*="cursor-pointer"]')
    await header.trigger('click')

    expect(wrapper.text()).toContain('청년기본법 제10조')
    expect(wrapper.text()).toContain('주거기본법 제5조')
    expect(wrapper.text()).toContain('사회보장기본법 제3조')
  })

  it('relatedLaws가 null이면 빈 상태 메시지가 표시되어야 한다', async () => {
    const wrapper = mount(RelatedLawsCard, {
      props: {
        relatedLaws: null,
      },
    })

    // 헤더 클릭하여 펼치기
    const header = wrapper.find('[class*="cursor-pointer"]')
    await header.trigger('click')

    expect(wrapper.text()).toContain('관련 법령 정보가 없습니다')
  })

  it('relatedLaws가 빈 문자열이면 빈 상태 메시지가 표시되어야 한다', async () => {
    const wrapper = mount(RelatedLawsCard, {
      props: {
        relatedLaws: '',
      },
    })

    // 헤더 클릭하여 펼치기
    const header = wrapper.find('[class*="cursor-pointer"]')
    await header.trigger('click')

    expect(wrapper.text()).toContain('관련 법령 정보가 없습니다')
  })

  it('다시 클릭하면 내용이 접혀야 한다', async () => {
    const wrapper = mount(RelatedLawsCard, {
      props: {
        relatedLaws: '청년기본법 제10조',
      },
    })

    const header = wrapper.find('[class*="cursor-pointer"]')

    // 첫 번째 클릭: 펼치기
    await header.trigger('click')
    let content = wrapper.find('div.p-4')
    const style = content.attributes('style') || ''
    expect(style).not.toContain('display: none')

    // 두 번째 클릭: 접기
    await header.trigger('click')
    content = wrapper.find('div.p-4')
    expect(content.attributes('style')).toContain('display: none')
  })

  it('|| 구분자로 된 법령 목록이 분리되어 표시되어야 한다', async () => {
    const wrapper = mount(RelatedLawsCard, {
      props: {
        relatedLaws: '조세특례제한법(제100조의10, 제0항)||조세특례제한법(제100조의11, 제0항)||조세특례제한법(제100조의12, 제0항)',
      },
    })

    // 헤더 클릭하여 펼치기
    const header = wrapper.find('[class*="cursor-pointer"]')
    await header.trigger('click')

    expect(wrapper.text()).toContain('조세특례제한법(제100조의10, 제0항)')
    expect(wrapper.text()).toContain('조세특례제한법(제100조의11, 제0항)')
    expect(wrapper.text()).toContain('조세특례제한법(제100조의12, 제0항)')

    // 개별 항목으로 렌더링되었는지 확인 (3개의 카드)
    const lawCards = wrapper.findAll('.rounded-lg.border')
    expect(lawCards.length).toBe(3)
  })
})
