<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-16">
      <!-- 헤더 -->
      <section class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          지원금 검색
        </h1>
        <p class="text-gray-600">
          아래 조건으로 검색하세요
        </p>
      </section>

      <!-- 검색 폼 -->
      <section class="max-w-2xl mx-auto mb-12">
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <SearchForm
            :loading="loading"
            :error="error"
            @submit="handleSearch"
          />
        </div>
      </section>

      <!-- 결과 없음 -->
      <section
        v-if="searchPerformed && results.length === 0"
        class="max-w-2xl mx-auto"
      >
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p class="text-gray-600">검색 결과가 없습니다.</p>
        </div>
      </section>

      <!-- 검색 결과 -->
      <section v-else-if="results.length > 0" class="max-w-6xl mx-auto">
        <div class="mb-6">
          <p class="text-gray-700">
            총 <strong>{{ totalCount.toLocaleString() }}</strong>개의 지원금 중
            <strong>{{ results.length }}</strong>개 표시
          </p>
        </div>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <BenefitCard v-for="benefit in results" :key="benefit.id" :benefit="benefit" />
        </div>

        <!-- 더 보기 버튼 -->
        <div v-if="hasMore()" class="mt-8 text-center">
          <button
            :disabled="loadingMore"
            class="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleLoadMore"
          >
            <span v-if="loadingMore">로딩 중...</span>
            <span v-else>더 보기 ({{ currentPage }}/{{ totalPages }} 페이지)</span>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchForm from '../components/SearchForm.vue'
import BenefitCard from '../components/BenefitCard.vue'
import { useBenefitSearch, type BenefitSearchRequest } from '../composables/useBenefitSearch'

// SEO 메타태그
useSeoMeta({
  title: '검색 결과 - 복지알리미',
  description: '맞춤형 정부 지원금 검색 결과를 확인하세요',
})

// 검색 composable
const {
  loading,
  loadingMore,
  error,
  results,
  totalCount,
  currentPage,
  totalPages,
  search,
  loadMore,
  hasMore,
} = useBenefitSearch()

// 상태 관리
const searchPerformed = ref(false)

// 검색 핸들러
const handleSearch = async (params: BenefitSearchRequest) => {
  try {
    await search(params)
    searchPerformed.value = true
  } catch {
    // 에러는 composable에서 처리됨
  }
}

// 더 보기 핸들러
const handleLoadMore = async () => {
  try {
    await loadMore()
  } catch {
    // 에러는 composable에서 처리됨
  }
}
</script>
