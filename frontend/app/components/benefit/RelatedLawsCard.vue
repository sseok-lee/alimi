<template>
  <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
    <!-- 헤더 -->
    <div
      class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      @click="toggleExpanded"
    >
      <h2 class="text-lg font-bold flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">gavel</span>
          관련 법령
        </div>
        <span class="material-symbols-outlined text-gray-400 transition-transform" :class="{ 'rotate-180': isExpanded }">
          expand_more
        </span>
      </h2>
    </div>

    <!-- 내용 (접이식) -->
    <div v-show="isExpanded" class="p-4">
      <!-- 법령 목록이 있을 때 -->
      <div v-if="lawsList.length > 0" class="space-y-2">
        <div
          v-for="(law, index) in lawsList"
          :key="index"
          class="flex items-center p-2.5 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-700/30 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <div class="size-6 rounded bg-white dark:bg-gray-700 flex items-center justify-center text-primary flex-shrink-0">
            <span class="material-symbols-outlined text-[16px]">menu_book</span>
          </div>
          <div class="ml-2.5 flex-1">
            <p class="text-sm text-gray-900 dark:text-white">{{ law }}</p>
          </div>
        </div>
      </div>

      <!-- 법령 목록이 없을 때 -->
      <div v-else class="text-center py-8 text-gray-500">
        <span class="material-symbols-outlined text-4xl mb-2 block text-gray-300">info</span>
        <p>관련 법령 정보가 없습니다</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  relatedLaws: string | null
}>()

const isExpanded = ref(false)

// 토글 함수
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

// 법령 목록을 배열로 변환 (|| 또는 줄바꿈으로 구분)
const lawsList = computed(() => {
  if (!props.relatedLaws || props.relatedLaws.trim() === '') {
    return []
  }
  // || 구분자 또는 줄바꿈으로 분리
  return props.relatedLaws
    .split(/\|\||\n/)
    .map(law => law.trim())
    .filter(law => law.length > 0)
})
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.text-primary {
  color: #3b82f6;
}
</style>
