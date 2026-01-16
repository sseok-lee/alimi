<template>
  <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
    <!-- 헤더 -->
    <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
      <h2 class="text-lg font-bold flex items-center gap-2">
        <span class="material-symbols-outlined text-primary">steps</span>
        신청 방법
      </h2>
    </div>

    <!-- 내용 -->
    <div class="p-6">
      <!-- 신청 방법이 있을 때 -->
      <div v-if="steps.length > 0" class="flex flex-wrap gap-3">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="method-tag inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
          {{ step }}
        </div>
      </div>

      <!-- 신청 방법이 없을 때 -->
      <div v-else class="text-center py-8 text-gray-500">
        <span class="material-symbols-outlined text-4xl mb-2 block text-gray-300">info</span>
        <p>신청 방법 정보가 없습니다</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  applicationMethod: string | null
}>()

// 신청 방법을 배열로 변환 (|| 또는 줄바꿈으로 구분)
const steps = computed(() => {
  if (!props.applicationMethod || props.applicationMethod.trim() === '') {
    return []
  }
  return props.applicationMethod
    .split(/\|\||\n/)
    .map(step => step.trim())
    .map(step => step.replace(/^기타\s*/, '')) // "기타" 접두어 제거
    .filter(step => step.length > 0)
})
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.text-primary {
  color: #3b82f6;
}

.bg-primary {
  background-color: #3b82f6;
}
</style>
