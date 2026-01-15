<template>
  <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
    <!-- 헤더 -->
    <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
      <h2 class="text-lg font-bold flex items-center gap-2">
        <span class="material-symbols-outlined text-primary">fact_check</span>
        자격 요건
      </h2>
    </div>

    <!-- 내용 -->
    <div class="p-6 sm:p-8">
      <!-- 데이터가 있을 때 -->
      <ul v-if="hasEligibilityData" class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
        <li v-if="targetAudience" class="flex items-start gap-3">
          <span class="material-symbols-outlined text-green-600 mt-0.5 text-[20px]">check</span>
          <div>
            <p class="font-bold text-sm">대상자</p>
            <p class="text-sm text-gray-600">{{ targetAudience }}</p>
          </div>
        </li>
        <li v-if="selectionCriteria" class="flex items-start gap-3">
          <span class="material-symbols-outlined text-green-600 mt-0.5 text-[20px]">check</span>
          <div>
            <p class="font-bold text-sm">선발 기준</p>
            <p class="text-sm text-gray-600">{{ selectionCriteria }}</p>
          </div>
        </li>
      </ul>

      <!-- 데이터가 없을 때 -->
      <div v-else class="text-center py-8 text-gray-500">
        <span class="material-symbols-outlined text-4xl mb-2 block text-gray-300">info</span>
        <p>자격 요건 정보가 없습니다</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  targetAudience: string | null
  selectionCriteria: string | null
}>()

const hasEligibilityData = computed(() => {
  return props.targetAudience || props.selectionCriteria
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
