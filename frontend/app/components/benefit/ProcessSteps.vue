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
    <div class="p-6 relative">
      <!-- 단계들이 있을 때 -->
      <template v-if="steps.length > 0">
        <!-- 연결선 (데스크탑) -->
        <div class="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-100 dark:bg-gray-700 hidden sm:block md:left-8"></div>

        <div class="space-y-8 sm:pl-10 relative">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="relative flex flex-col sm:flex-row gap-4"
          >
            <!-- 단계 번호 배지 (데스크탑) -->
            <div
              :class="[
                'step-badge',
                'hidden sm:flex absolute -left-[45px] top-0 size-8 rounded-full items-center justify-center font-bold text-sm shadow-md ring-4 ring-white dark:ring-gray-800',
                index === 0
                  ? 'bg-primary text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-600 dark:bg-gray-700 dark:border-gray-600'
              ]"
            >
              {{ index + 1 }}
            </div>

            <!-- 단계 번호 배지 (모바일) -->
            <div
              :class="[
                'step-badge',
                'sm:hidden mb-2 inline-flex size-8 rounded-full items-center justify-center font-bold text-sm',
                index === 0
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-200 text-gray-500'
              ]"
            >
              {{ index + 1 }}
            </div>

            <div>
              <h3 class="font-bold text-gray-900 dark:text-white">{{ step }}</h3>
            </div>
          </div>
        </div>
      </template>

      <!-- 단계가 없을 때 -->
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

// 줄바꿈으로 구분된 단계를 배열로 변환
const steps = computed(() => {
  if (!props.applicationMethod || props.applicationMethod.trim() === '') {
    return []
  }
  return props.applicationMethod
    .split('\n')
    .map(step => step.trim())
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
