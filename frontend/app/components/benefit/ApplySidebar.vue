<template>
  <div class="sticky top-24 space-y-4">
    <!-- 신청 카드 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 flex flex-col gap-6">
      <!-- 마감일 정보 -->
      <div v-if="applicationDeadline" class="flex justify-between items-start">
        <div>
          <p class="text-sm font-medium text-gray-600">신청 마감</p>
          <div class="flex items-baseline gap-2 mt-1">
            <h2 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {{ dDayText }}
            </h2>
            <span
              v-if="isUrgent"
              class="text-sm font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded"
            >
              긴급
            </span>
          </div>
          <p class="text-sm text-gray-600 mt-1">{{ formattedDeadline }}</p>
        </div>
        <div class="size-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600">
          <span class="material-symbols-outlined">calendar_month</span>
        </div>
      </div>

      <!-- 진행률 바 (마감일이 있을 때만) -->
      <div v-if="applicationDeadline && progressPercentage !== null" class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div class="h-full bg-primary rounded-full" :style="{ width: `${progressPercentage}%` }"></div>
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

      <!-- 출처 정보 -->
      <div class="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
          <span class="material-symbols-outlined text-[16px] text-green-600">verified</span>
          <span>공식 정부 사이트</span>
        </div>
        <div v-if="organizationName" class="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
          <span class="material-symbols-outlined text-[16px] text-gray-400">apartment</span>
          <span>{{ organizationName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  applicationDeadline: string | null
  link: string
  organizationName: string | null
}>()

// D-Day 계산
const daysLeft = computed(() => {
  if (!props.applicationDeadline) return null
  const deadline = new Date(props.applicationDeadline)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  deadline.setHours(0, 0, 0, 0)
  return Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
})

const dDayText = computed(() => {
  if (daysLeft.value === null) return ''
  if (daysLeft.value === 0) return 'D-Day'
  if (daysLeft.value > 0) return `D-${daysLeft.value}`
  return `마감 (${Math.abs(daysLeft.value)}일 전)`
})

const isUrgent = computed(() => {
  return daysLeft.value !== null && daysLeft.value >= 0 && daysLeft.value <= 7
})

// 진행률 계산 (예: 30일 중 25일 경과 = 83%)
const progressPercentage = computed(() => {
  if (daysLeft.value === null) return null
  const totalDays = 30 // 임의의 전체 기간 (실제로는 시작일이 필요)
  const elapsed = totalDays - daysLeft.value
  const percentage = Math.min(100, Math.max(0, (elapsed / totalDays) * 100))
  return Math.round(percentage)
})

// 마감일 포맷팅
const formattedDeadline = computed(() => {
  if (!props.applicationDeadline) return ''
  const date = new Date(props.applicationDeadline)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.bg-primary {
  background-color: #3b82f6;
}
</style>
