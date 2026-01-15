<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-16">
      <!-- 히어로 섹션 -->
      <section class="text-center mb-12">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          맞춤형 지원금 찾기
        </h1>
        <p class="text-lg md:text-xl text-gray-600 mb-8">
          나이, 소득, 지역 3가지만 입력하면<br />
          당신을 위한 정부 지원금을 찾아드립니다
        </p>
      </section>

      <!-- 검색 폼 -->
      <section class="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <SearchForm
          :loading="loading"
          :error="error"
          @submit="handleSearch"
        />
      </section>

      <!-- 검색 결과 -->
      <section v-if="results.length > 0" class="max-w-6xl mx-auto mt-12">
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

      <!-- 안내 섹션 -->
      <section class="max-w-4xl mx-auto mt-16">
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-3xl">🎯</span>
            </div>
            <h3 class="font-semibold text-lg mb-2">정확한 매칭</h3>
            <p class="text-gray-600 text-sm">
              당신의 조건에 딱 맞는<br />지원금만 추천합니다
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-3xl">⚡</span>
            </div>
            <h3 class="font-semibold text-lg mb-2">빠른 검색</h3>
            <p class="text-gray-600 text-sm">
              3가지 정보만 입력하면<br />즉시 결과를 확인할 수 있어요
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-3xl">📱</span>
            </div>
            <h3 class="font-semibold text-lg mb-2">간편한 신청</h3>
            <p class="text-gray-600 text-sm">
              검색 결과에서 바로<br />신청 페이지로 이동할 수 있어요
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchForm from '../components/SearchForm.vue'
import BenefitCard from '../components/BenefitCard.vue'
import { useBenefitSearch, type BenefitSearchRequest } from '../composables/useBenefitSearch'

// SEO 메타태그 설정
useSeoMeta({
  title: '복지알리미 - 맞춤형 정부 지원금 검색',
  description: '나이, 소득, 지역 3가지만 입력하면 당신을 위한 정부 지원금을 찾아드립니다. 청년도약계좌, 주거지원, 취업지원 등 다양한 복지 혜택을 한눈에 확인하세요.',
  ogTitle: '복지알리미 - 맞춤형 정부 지원금 검색',
  ogDescription: '나이, 소득, 지역 3가지만 입력하면 당신을 위한 정부 지원금을 찾아드립니다.',
  ogImage: '/og-image.png',
  ogUrl: 'https://welfare-notifier.vercel.app',
  twitterCard: 'summary_large_image',
  twitterTitle: '복지알리미 - 맞춤형 정부 지원금 검색',
  twitterDescription: '나이, 소득, 지역 3가지만 입력하면 당신을 위한 정부 지원금을 찾아드립니다.',
  twitterImage: '/og-image.png',
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

// 검색 핸들러
const handleSearch = async (params: BenefitSearchRequest) => {
  try {
    await search(params)
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
