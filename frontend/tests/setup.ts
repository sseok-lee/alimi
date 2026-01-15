import { vi } from 'vitest'
import { defineComponent, h } from 'vue'

// Nuxt의 auto-imports를 모킹
global.navigateTo = vi.fn()
global.useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
}))
global.useSeoMeta = vi.fn()
global.useHead = vi.fn()
global.useRuntimeConfig = vi.fn(() => ({
  public: {
    apiBase: 'http://localhost:8000',
    gaId: '',
  },
}))

// VueDatePicker mock
vi.mock('@vuepic/vue-datepicker', () => ({
  default: defineComponent({
    name: 'VueDatePicker',
    props: ['modelValue', 'name', 'placeholder'],
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      return () => h('input', {
        type: 'date',
        name: props.name || 'birthdate',
        value: props.modelValue ? formatDate(props.modelValue) : '',
        placeholder: props.placeholder,
        onInput: (e: Event) => {
          const target = e.target as HTMLInputElement
          if (target.value) {
            emit('update:modelValue', new Date(target.value))
          } else {
            emit('update:modelValue', null)
          }
        },
      })
    },
  }),
}))

function formatDate(date: Date | string): string {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
