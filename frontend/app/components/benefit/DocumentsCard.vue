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
    <div class="p-6 space-y-6">
      <!-- 일반 구비 서류 -->
      <div>
        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">일반 구비 서류</h3>
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

      <!-- 공무원 확인 서류 -->
      <div v-if="officialConfirmDocsList.length > 0" class="pt-6 border-t border-gray-100 dark:border-gray-700">
        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">공무원 확인 서류</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="(doc, index) in officialConfirmDocsList"
            :key="index"
            class="flex items-center p-3 rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800 hover:border-purple-300 transition-all cursor-pointer group"
          >
            <div class="size-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 group-hover:text-purple-700 transition-colors">
              <span class="material-symbols-outlined">badge</span>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ doc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 본인 확인 서류 -->
      <div v-if="identityConfirmDocsList.length > 0" class="pt-6 border-t border-gray-100 dark:border-gray-700">
        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">본인 확인 서류</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="(doc, index) in identityConfirmDocsList"
            :key="index"
            class="flex items-center p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 hover:border-amber-300 transition-all cursor-pointer group"
          >
            <div class="size-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 group-hover:text-amber-700 transition-colors">
              <span class="material-symbols-outlined">fingerprint</span>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ doc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  documents: string | null
  officialConfirmDocs: string | null
  identityConfirmDocs: string | null
}>()

// 카테고리 헤더 패턴 (필터링 대상)
const HEADER_PATTERNS = [
  '제출서류', '확인서류', '확인 서류', '구비서류', '구비 서류',
  '필요서류', '필요 서류', '증빙서류', '증빙 서류',
  '신청인', '공무원', '본인확인'
]

// 서류 항목인지 확인 (헤더가 아닌 실제 항목)
const isDocumentItem = (text: string): boolean => {
  // 카테고리 헤더 제외
  if (HEADER_PATTERNS.some(pattern => text.includes(pattern))) {
    return false
  }
  // 빈 텍스트 또는 숫자만 있는 경우 제외
  if (text.length < 2) return false
  return true
}

// 서류 이름 정리 (앞의 기호 제거)
const cleanDocumentName = (text: string): string => {
  return text
    .replace(/^[-·•○●◎◇◆□■▶▷※★☆\d]+[.\s)]*/, '') // 앞의 기호, 번호 제거
    .trim()
}

// 서류 목록을 배열로 변환 (|| 또는 줄바꿈으로 구분)
const documentList = computed(() => {
  if (!props.documents || props.documents.trim() === '') {
    return []
  }
  return props.documents
    .split(/\|\||\n/)
    .map(doc => doc.trim())
    .filter(doc => doc.length > 0 && isDocumentItem(doc))
    .map(cleanDocumentName)
    .filter(doc => doc.length > 0)
})

const officialConfirmDocsList = computed(() => {
  if (!props.officialConfirmDocs || props.officialConfirmDocs.trim() === '') {
    return []
  }
  return props.officialConfirmDocs
    .split(/\|\||\n/)
    .map(doc => doc.trim())
    .filter(doc => doc.length > 0 && isDocumentItem(doc))
    .map(cleanDocumentName)
    .filter(doc => doc.length > 0)
})

const identityConfirmDocsList = computed(() => {
  if (!props.identityConfirmDocs || props.identityConfirmDocs.trim() === '') {
    return []
  }
  return props.identityConfirmDocs
    .split(/\|\||\n/)
    .map(doc => doc.trim())
    .filter(doc => doc.length > 0 && isDocumentItem(doc))
    .map(cleanDocumentName)
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
