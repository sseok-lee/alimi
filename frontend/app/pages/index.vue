<template>
  <div class="min-h-screen bg-background-light">
    <!-- 헤더 -->
    <header class="bg-white border-b border-gray-100">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-3xl">volunteer_activism</span>
            <span class="font-display text-xl font-bold text-text-primary">복지알리미</span>
          </div>
          <nav class="hidden md:flex items-center gap-6">
            <a href="#features" class="text-sm font-medium text-text-secondary hover:text-primary transition-colors">서비스 소개</a>
            <a href="#search" class="text-sm font-medium text-text-secondary hover:text-primary transition-colors">지원금 검색</a>
          </nav>
        </div>
      </div>
    </header>

    <main>
      <!-- 히어로 섹션 -->
      <section class="relative overflow-hidden">
        <!-- 배경 그라데이션 -->
        <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none"></div>

        <div class="container mx-auto px-4 py-16 md:py-24">
          <div class="text-center max-w-3xl mx-auto">
            <!-- 배지 -->
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-soft mb-6">
              <span class="material-symbols-outlined text-primary text-lg">verified</span>
              <span class="text-sm font-medium text-text-secondary">정부24 공식 데이터 기반</span>
            </div>

            <h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary mb-6 leading-tight">
              나에게 맞는<br class="hidden md:block" />
              <span class="text-primary">정부 지원금</span>을 찾아보세요
            </h1>

            <p class="text-lg md:text-xl text-text-secondary mb-10 leading-relaxed">
              생년월일, 소득, 지역 3가지만 입력하면<br />
              받을 수 있는 모든 지원금을 한눈에 확인할 수 있어요
            </p>

            <!-- 스크롤 유도 버튼 -->
            <a
              href="#search"
              class="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-white text-lg font-bold rounded-2xl shadow-lg shadow-primary/30 transition-all duration-200 hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98]"
            >
              지금 바로 검색하기
              <span class="material-symbols-outlined text-xl">arrow_downward</span>
            </a>
          </div>
        </div>
      </section>

      <!-- 특징 섹션 -->
      <section id="features" class="py-16 md:py-20 bg-white">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="font-display text-2xl md:text-3xl font-bold text-text-primary mb-3">
              왜 복지알리미인가요?
            </h2>
            <p class="text-text-secondary">
              복잡한 지원금, 쉽고 빠르게 찾아드립니다
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div class="text-center p-6">
              <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <span class="material-symbols-outlined text-primary text-3xl">target</span>
              </div>
              <h3 class="font-display text-lg font-bold text-text-primary mb-2">정확한 매칭</h3>
              <p class="text-text-secondary text-sm leading-relaxed">
                당신의 조건에 딱 맞는<br />지원금만 추천합니다
              </p>
            </div>

            <div class="text-center p-6">
              <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <span class="material-symbols-outlined text-primary text-3xl">bolt</span>
              </div>
              <h3 class="font-display text-lg font-bold text-text-primary mb-2">빠른 검색</h3>
              <p class="text-text-secondary text-sm leading-relaxed">
                3가지 정보만 입력하면<br />즉시 결과를 확인할 수 있어요
              </p>
            </div>

            <div class="text-center p-6">
              <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <span class="material-symbols-outlined text-primary text-3xl">touch_app</span>
              </div>
              <h3 class="font-display text-lg font-bold text-text-primary mb-2">간편한 신청</h3>
              <p class="text-text-secondary text-sm leading-relaxed">
                검색 결과에서 바로<br />신청 페이지로 이동할 수 있어요
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 검색 폼 섹션 -->
      <section id="search" class="py-16 md:py-20">
        <div class="container mx-auto px-4">
          <div class="text-center mb-10">
            <h2 class="font-display text-2xl md:text-3xl font-bold text-text-primary mb-3">
              지원금 검색
            </h2>
            <p class="text-text-secondary">
              아래 정보를 입력하고 받을 수 있는 지원금을 확인하세요
            </p>
          </div>

          <div class="max-w-xl mx-auto">
            <div class="bg-white rounded-3xl shadow-card p-6 md:p-8">
              <SearchForm
                :loading="loading"
                :error="error"
                @submit="handleSearch"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- 검색 결과 섹션 -->
      <section v-if="results.length > 0" class="py-16 md:py-20 bg-white">
        <div class="container mx-auto px-4">
          <!-- 결과 헤더 -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 class="font-display text-2xl font-bold text-text-primary mb-1">
                검색 결과
              </h2>
              <p class="text-text-secondary">
                총 <span class="font-bold text-primary">{{ totalCount.toLocaleString() }}</span>개의 지원금 중
                <span class="font-bold">{{ results.length }}</span>개 표시
              </p>
            </div>

            <!-- 정렬 옵션 + 공유 버튼 -->
            <div class="flex items-center gap-3">
              <select
                v-model="currentSortBy"
                class="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-text-secondary rounded-xl text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                @change="handleSortChange"
              >
                <option value="">기본 정렬</option>
                <option value="latest">최신순</option>
                <option value="popular">인기순</option>
              </select>

              <!-- 공유 버튼 -->
              <UiShareButton
                v-if="lastSearchParams"
                :search-params="lastSearchParams"
                :result-count="results.length"
              />
            </div>
          </div>

          <!-- 카드 그리드 -->
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard
              v-for="benefit in results"
              :key="benefit.id"
              :benefit="benefit"
              @click="handleCardClick"
            />
          </div>

          <!-- 더 보기 버튼 -->
          <div v-if="hasMore()" class="mt-12 text-center">
            <button
              :disabled="loadingMore"
              class="inline-flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="handleLoadMore"
            >
              <span v-if="loadingMore" class="flex items-center gap-2">
                <span class="animate-spin material-symbols-outlined text-lg">progress_activity</span>
                로딩 중...
              </span>
              <span v-else class="flex items-center gap-2">
                더 보기
                <span class="text-sm font-normal text-text-secondary">({{ currentPage }}/{{ totalPages }} 페이지)</span>
                <span class="material-symbols-outlined text-lg">expand_more</span>
              </span>
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- 푸터 -->
    <footer class="bg-white border-t border-gray-100 py-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-xl">volunteer_activism</span>
            <span class="font-display text-sm font-semibold text-text-primary">복지알리미</span>
          </div>
          <p class="text-sm text-text-muted text-center md:text-right">
            정부24 공공데이터 기반 서비스 | 개인정보를 수집하지 않습니다
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SearchForm from '../components/SearchForm.vue'
import BenefitCard from '../components/BenefitCard.vue'
import { useBenefitSearch, type BenefitSearchRequest, type BenefitResponse } from '../composables/useBenefitSearch'
import { useShareUrl } from '../composables/useShareUrl'

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

// URL 공유 composable
const { decodeSearchParams, updateUrl, hasSearchParams } = useShareUrl()

// 상태 관리
const lastSearchParams = ref<BenefitSearchRequest | null>(null)
const currentSortBy = ref<'' | 'latest' | 'popular'>('')

// 동적 SEO 메타태그 (검색 결과에 따라 변경)
const seoTitle = computed(() => {
  if (lastSearchParams.value) {
    return `${lastSearchParams.value.region} ${lastSearchParams.value.age}세 지원금 검색 - 복지알리미`
  }
  return '복지알리미 - 맞춤형 정부 지원금 검색'
})

const seoDescription = computed(() => {
  if (lastSearchParams.value && results.value.length > 0) {
    return `${lastSearchParams.value.region} 지역, 만 ${lastSearchParams.value.age}세 대상 정부 지원금 ${results.value.length}건`
  }
  return '나이, 소득, 지역 3가지만 입력하면 당신을 위한 정부 지원금을 찾아드립니다. 청년도약계좌, 주거지원, 취업지원 등 다양한 복지 혜택을 한눈에 확인하세요.'
})

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: '/og-image.png',
  ogUrl: 'https://welfare-notifier.vercel.app',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: '/og-image.png',
})

// URL 파라미터가 있으면 자동으로 검색 실행
onMounted(async () => {
  if (hasSearchParams()) {
    const params = decodeSearchParams()
    if (params) {
      lastSearchParams.value = params
      await search(params)
    }
  }
})

// 검색 핸들러
const handleSearch = async (params: BenefitSearchRequest) => {
  try {
    lastSearchParams.value = params
    currentSortBy.value = ''
    updateUrl(params) // URL 업데이트
    await search(params)
  } catch {
    // 에러는 composable에서 처리됨
  }
}

// 정렬 변경 핸들러
const handleSortChange = async () => {
  if (!lastSearchParams.value) return

  try {
    const paramsWithSort = {
      ...lastSearchParams.value,
      ...(currentSortBy.value ? { sortBy: currentSortBy.value } : {})
    }
    await search(paramsWithSort)
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

// 카드 클릭 핸들러 (상세 페이지로 이동 - Phase 6에서 구현 예정)
const handleCardClick = (benefit: BenefitResponse) => {
  navigateTo(`/benefits/${benefit.id}`)
}
</script>
