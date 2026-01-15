<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 lg:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
    <div class="flex gap-3 max-w-md mx-auto">
      <a
        :href="link"
        target="_blank"
        rel="noopener noreferrer"
        class="flex-1 bg-primary text-white font-bold rounded-lg flex items-center justify-center py-3 shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors"
      >
        신청하기
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  link: string
}>()
</script>

<style scoped>
.bg-primary {
  background-color: #3b82f6;
}
</style>
