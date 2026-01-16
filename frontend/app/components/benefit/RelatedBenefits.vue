<template>
  <section class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
    <h3 class="text-xl font-bold mb-6 text-gray-900 dark:text-white">관련 서비스</h3>

    <!-- 관련 서비스 카드 -->
    <div v-if="benefits.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <NuxtLink
        v-for="benefit in benefits"
        :key="benefit.id"
        :to="`/benefits/${benefit.id}`"
        class="group block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
      >
        <!-- 카테고리 그라디언트 헤더 -->
        <div class="h-32 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 relative">
          <div class="absolute bottom-3 left-3 bg-white/90 dark:bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold shadow-sm">
            {{ benefit.category }}
          </div>
        </div>

        <!-- 카드 내용 -->
        <div class="p-4">
          <h4 class="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
            {{ benefit.name }}
          </h4>
          <p v-if="benefit.description" class="text-sm text-gray-600 mt-2 line-clamp-2">
            {{ benefit.description }}
          </p>
          <div class="mt-4 flex items-center justify-between text-xs text-gray-400">
            <span>조회수: {{ benefit.viewCount.toLocaleString() }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- 빈 상태 -->
    <div v-else class="text-center py-12 text-gray-500">
      <span class="material-symbols-outlined text-5xl mb-3 block text-gray-300">search_off</span>
      <p>관련 서비스가 없습니다</p>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface SimpleBenefit {
  id: string
  name: string
  category: string
  description: string | null
  link: string
  viewCount: number
}

defineProps<{
  benefits: SimpleBenefit[]
}>()
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.text-primary {
  color: #3b82f6;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
