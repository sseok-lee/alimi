<template>
  <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
    <!-- 헤더 -->
    <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
      <h2 class="text-lg font-bold flex items-center gap-2">
        <span class="material-symbols-outlined text-primary">folder_open</span>
        구비 서류
      </h2>
    </div>

    <!-- 내용 -->
    <div class="p-6">
      <!-- 서류 목록이 있을 때 -->
      <div v-if="documentList.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="(doc, index) in documentList"
          :key="index"
          class="flex items-center p-3 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
        >
          <div class="size-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 group-hover:text-primary transition-colors">
            <span class="material-symbols-outlined">description</span>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ doc }}</p>
          </div>
        </div>
      </div>

      <!-- 서류 목록이 없을 때 -->
      <div v-else class="text-center py-8 text-gray-500">
        <span class="material-symbols-outlined text-4xl mb-2 block text-gray-300">info</span>
        <p>구비 서류 정보가 없습니다</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  documents: string | null
}>()

// 줄바꿈으로 구분된 서류 목록을 배열로 변환
const documentList = computed(() => {
  if (!props.documents || props.documents.trim() === '') {
    return []
  }
  return props.documents
    .split('\n')
    .map(doc => doc.trim())
    .filter(doc => doc.length > 0)
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
