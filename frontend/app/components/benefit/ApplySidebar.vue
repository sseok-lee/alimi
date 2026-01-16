<template>
  <div class="sticky top-24 space-y-4">
    <!-- 신청 카드 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 flex flex-col gap-6">
      <!-- 신청 기간 정보 -->
      <div v-if="applicationDeadline" class="flex justify-between items-start">
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">신청 기간</p>

          <!-- 상시형 -->
          <div v-if="deadlineInfo.type === 'always'" class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold">
              <span class="size-2 rounded-full bg-green-500 animate-pulse"></span>
              상시 신청
            </span>
          </div>

          <!-- 예산 소진형 -->
          <div v-else-if="deadlineInfo.type === 'budget'">
            <div class="flex items-center gap-2 mb-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-semibold">
                <span class="material-symbols-outlined text-[16px]">bolt</span>
                선착순
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ deadlineInfo.originalText }}</p>
          </div>

          <!-- 기간형 -->
          <div v-else-if="deadlineInfo.type === 'period'">
            <div class="flex items-baseline gap-2 mb-1">
              <h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {{ dDayText }}
              </h2>
              <span
                v-if="deadlineInfo.isUrgent"
                class="text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded"
              >
                마감 임박
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ deadlineInfo.displayText }}</p>

            <!-- 진행률 바 -->
            <div v-if="deadlineInfo.progressPercentage !== undefined" class="mt-3 w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all"
                :class="deadlineInfo.isUrgent ? 'bg-red-500' : 'bg-primary'"
                :style="{ width: `${deadlineInfo.progressPercentage}%` }"
              ></div>
            </div>
          </div>

          <!-- 예정/미정형 -->
          <div v-else-if="deadlineInfo.type === 'scheduled'">
            <p class="text-sm text-gray-500 dark:text-gray-400 italic">{{ deadlineInfo.originalText }}</p>
          </div>

          <!-- 일반 텍스트 -->
          <div v-else>
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{{ deadlineInfo.displayText }}</p>
          </div>
        </div>

        <div class="size-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 flex-shrink-0">
          <span class="material-symbols-outlined">calendar_month</span>
        </div>
      </div>

      <!-- 신청 버튼 -->
      <a
        :href="link"
        target="_blank"
        rel="noopener noreferrer"
        class="apply-button w-full h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
      >
        <span>신청하기</span>
        <span class="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">open_in_new</span>
      </a>

      <!-- 전화 문의 버튼 -->
      <a
        v-if="contactInfo"
        :href="`tel:${contactInfo.replace(/[^0-9]/g, '')}`"
        class="w-full h-12 bg-white hover:bg-gray-50 text-primary font-semibold rounded-lg border-2 border-primary transition-all flex items-center justify-center gap-2 group"
      >
        <span class="material-symbols-outlined text-[20px]">call</span>
        <span>전화 문의</span>
      </a>

      <!-- 출처 정보 -->
      <div class="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
          <span class="material-symbols-outlined text-[16px] text-green-600">verified</span>
          <span>공식 정부 사이트</span>
        </div>
        <div v-if="organizationName" class="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
          <span class="material-symbols-outlined text-[16px] text-gray-400">apartment</span>
          <span>소관기관: {{ organizationName }}</span>
        </div>
        <div v-if="applyAgency" class="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
          <span class="material-symbols-outlined text-[16px] text-gray-400">domain</span>
          <span>접수기관: {{ applyAgency }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { analyzeDeadline } from '../../composables/useDeadline'

const props = defineProps<{
  applicationDeadline: string | null
  link: string
  organizationName: string | null
  applyAgency: string | null
  contactInfo: string | null
}>()

// 신청 기간 분석
const deadlineInfo = computed(() => analyzeDeadline(props.applicationDeadline))

// D-Day 텍스트
const dDayText = computed(() => {
  const info = deadlineInfo.value
  if (info.daysLeft === undefined) return info.displayText
  if (info.daysLeft === 0) return 'D-Day'
  if (info.daysLeft > 0) return `D-${info.daysLeft}`
  return `마감 (${Math.abs(info.daysLeft)}일 전)`
})
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.bg-primary {
  background-color: #3b82f6;
}

.text-primary {
  color: #3b82f6;
}

.border-primary {
  border-color: #3b82f6;
}
</style>
