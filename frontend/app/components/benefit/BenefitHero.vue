<template>
  <section class="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
    <!-- 카테고리 배지 -->
    <div class="flex flex-wrap gap-2 mb-4">
      <span
        class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 border border-blue-100 dark:border-blue-800"
      >
        <span class="material-symbols-outlined text-[14px] icon-filled">home</span>
        {{ benefit.category }}
      </span>
    </div>

    <!-- 서비스명 -->
    <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
      {{ benefit.name }}
    </h1>

    <!-- 설명 -->
    <p v-if="benefit.description" class="description text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
      <span v-if="benefit.supportDetails" v-html="highlightAmount"></span>
      <span v-else>{{ benefit.description }}</span>
    </p>

    <!-- 메타 정보 -->
    <div class="mt-6 flex flex-wrap gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
      <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span class="material-symbols-outlined text-[20px] text-gray-400">visibility</span>
        <span>{{ formattedViewCount }} views today</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface BenefitHeroProp {
  name: string
  category: string
  description: string | null
  supportDetails: string | null
  viewCount: number
}

const props = defineProps<{
  benefit: BenefitHeroProp
}>()

// 조회수를 3자리마다 쉼표로 포맷
const formattedViewCount = computed(() => {
  return props.benefit.viewCount.toLocaleString('en-US')
})

// 지원 금액 강조 표시
const highlightAmount = computed(() => {
  if (!props.benefit.description || !props.benefit.supportDetails) return props.benefit.description
  return props.benefit.description.replace(
    props.benefit.supportDetails,
    `<strong class="text-gray-900 dark:text-white font-bold">${props.benefit.supportDetails}</strong>`
  )
})
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.icon-filled {
  font-variation-settings: 'FILL' 1;
}
</style>
