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
      <ul v-if="hasEligibilityData" class="space-y-5">
        <li v-if="cleanedTargetAudience" class="flex items-start gap-3">
          <span class="material-symbols-outlined text-green-600 mt-0.5 text-[20px] flex-shrink-0">check</span>
          <div>
            <p class="font-bold text-sm mb-1">대상자</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ cleanedTargetAudience }}</p>
          </div>
        </li>
        <li v-if="cleanedSelectionCriteria" class="flex items-start gap-3">
          <span class="material-symbols-outlined text-green-600 mt-0.5 text-[20px] flex-shrink-0">check</span>
          <div>
            <p class="font-bold text-sm mb-1">선발 기준</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ cleanedSelectionCriteria }}</p>
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

// 불필요한 특수문자 제거 및 || 구분자 처리
const cleanText = (text: string | null): string => {
  if (!text) return ''
  return text
    .replace(/[○●◎◇◆□■▶▷►▻☞☜★☆◀◁▲△▼▽◐◑]/g, '') // 특수 기호 제거
    .replace(/\|\|/g, ', ') // || 구분자를 쉼표로 변환
    .replace(/\s+/g, ' ')  // 연속 공백 정리
    .trim()
}

const cleanedTargetAudience = computed(() => cleanText(props.targetAudience))
const cleanedSelectionCriteria = computed(() => cleanText(props.selectionCriteria))

const hasEligibilityData = computed(() => {
  return cleanedTargetAudience.value || cleanedSelectionCriteria.value
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
