<template>
  <div class="min-h-screen bg-background-light">
    <!-- 헤더 -->
    <header class="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span class="material-symbols-outlined text-primary text-3xl">volunteer_activism</span>
            <span class="font-display text-xl font-bold text-text-primary">복지알리미</span>
          </NuxtLink>
          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink to="/" class="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
              홈
            </NuxtLink>
            <NuxtLink to="/search" class="text-sm font-medium text-primary">
              지원금 검색
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <main class="py-8 md:py-12">
      <div class="container mx-auto px-4">
        <!-- 2컬럼 레이아웃: 사이드바 + 메인 컨텐츠 -->
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- 사이드바: 검색 폼 -->
          <aside class="w-full lg:w-96 flex-shrink-0">
            <div class="lg:sticky lg:top-24">
              <div class="bg-white rounded-2xl shadow-card p-6">
                <!-- 사이드바 헤더 -->
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span class="material-symbols-outlined text-primary">search</span>
                  </div>
                  <div>
                    <h2 class="font-display text-lg font-bold text-text-primary">검색 조건</h2>
                    <p class="text-xs text-text-muted">조건을 입력하고 검색하세요</p>
                  </div>
                </div>

                <SearchForm
                  :loading="loading"
                  :error="error"
                  @submit="handleSearch"
                />
              </div>

              <!-- 검색 프로필 칩 (검색 후 표시) -->
              <div v-if="searchPerformed && lastSearchParams" class="mt-4 bg-white rounded-xl p-4 shadow-soft">
                <div class="flex items-center gap-2 mb-3">
                  <span class="material-symbols-outlined text-primary text-lg">person</span>
                  <span class="text-sm font-semibold text-text-primary">검색 프로필</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span class="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/5 text-primary text-xs font-medium rounded-full">
                    <span class="material-symbols-outlined text-sm">cake</span>
                    만 {{ lastSearchParams.age }}세
                  </span>
                  <span class="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/5 text-primary text-xs font-medium rounded-full">
                    <span class="material-symbols-outlined text-sm">location_on</span>
                    {{ lastSearchParams.region }}
                  </span>
                  <span class="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/5 text-primary text-xs font-medium rounded-full">
                    <span class="material-symbols-outlined text-sm">payments</span>
                    {{ formatIncome(lastSearchParams.income) }}
                  </span>
                  <span v-if="lastSearchParams.category" class="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/5 text-primary text-xs font-medium rounded-full">
                    <span class="material-symbols-outlined text-sm">category</span>
                    {{ lastSearchParams.category }}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          <!-- 메인 컨텐츠: 검색 결과 -->
          <div class="flex-1 min-w-0">
            <!-- 초기 상태: 검색 전 -->
            <div v-if="!searchPerformed" class="text-center py-16">
              <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="material-symbols-outlined text-primary text-4xl">search</span>
              </div>
              <h2 class="font-display text-xl font-bold text-text-primary mb-2">
                지원금을 검색해보세요
              </h2>
              <p class="text-text-secondary">
                왼쪽의 검색 조건을 입력하면<br />
                맞춤 지원금 목록이 여기에 표시됩니다
              </p>
            </div>

            <!-- 결과 없음 -->
            <div
              v-else-if="results.length === 0 && !loading"
              class="text-center py-16"
            >
              <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="material-symbols-outlined text-text-muted text-4xl">search_off</span>
              </div>
              <h2 class="font-display text-xl font-bold text-text-primary mb-2">
                검색 결과가 없습니다
              </h2>
              <p class="text-text-secondary mb-6">
                입력하신 조건에 맞는 지원금을 찾지 못했어요<br />
                검색 조건을 변경해서 다시 시도해보세요
              </p>
              <button
                class="inline-flex items-center gap-2 px-6 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors"
                @click="resetSearch"
              >
                <span class="material-symbols-outlined text-lg">refresh</span>
                조건 변경하기
              </button>
            </div>

            <!-- 검색 결과 -->
            <div v-else-if="results.length > 0">
              <!-- 결과 헤더 -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 class="font-display text-xl font-bold text-text-primary mb-1">
                    검색 결과
                  </h2>
                  <p class="text-sm text-text-secondary">
                    총 <span class="font-bold text-primary">{{ totalCount.toLocaleString() }}</span>개의 지원금 중
                    <span class="font-bold">{{ results.length }}</span>개 표시
                  </p>
                </div>

                <!-- 정렬 옵션 -->
                <div class="flex items-center gap-3">
                  <select
                    v-model="currentSortBy"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-primary text-text-secondary rounded-xl text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    @change="handleSortChange"
                  >
                    <option value="">기본 정렬</option>
                    <option value="latest">최신순</option>
                    <option value="popular">인기순</option>
                  </select>
                </div>
              </div>

              <!-- 카드 그리드 -->
              <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <BenefitCard
                  v-for="benefit in results"
                  :key="benefit.id"
                  :benefit="benefit"
                  @click="handleCardClick"
                />
              </div>

              <!-- 더 보기 버튼 -->
              <div v-if="hasMore()" class="mt-10 text-center">
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

            <!-- 로딩 상태 -->
            <div v-if="loading && results.length === 0" class="text-center py-16">
              <div class="w-16 h-16 mx-auto mb-4">
                <span class="animate-spin material-symbols-outlined text-primary text-5xl">progress_activity</span>
              </div>
              <p class="text-text-secondary">지원금을 검색하고 있습니다...</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 푸터 -->
    <footer class="bg-white border-t border-gray-100 py-6 mt-auto">
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
import { ref } from 'vue'
import SearchForm from '../components/SearchForm.vue'
import BenefitCard from '../components/BenefitCard.vue'
import { useBenefitSearch, type BenefitSearchRequest, type BenefitResponse } from '../composables/useBenefitSearch'

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
const lastSearchParams = ref<BenefitSearchRequest | null>(null)
const currentSortBy = ref<'' | 'latest' | 'popular'>('')

// 소득 포맷팅
const formatIncome = (income: number): string => {
  if (income === 0) return '무소득'
  if (income <= 20000000) return '저소득'
  if (income <= 40000000) return '중소득'
  if (income <= 75000000) return '중상소득'
  return '고소득'
}

// 검색 핸들러
const handleSearch = async (params: BenefitSearchRequest) => {
  try {
    await search(params)
    searchPerformed.value = true
    lastSearchParams.value = params
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

// 검색 초기화
const resetSearch = () => {
  searchPerformed.value = false
  lastSearchParams.value = null
  currentSortBy.value = ''
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

// 카드 클릭 핸들러 (상세 페이지로 이동 - Phase 6에서 구현 예정)
const handleCardClick = (benefit: BenefitResponse) => {
  navigateTo(`/benefits/${benefit.id}`)
}
</script>
