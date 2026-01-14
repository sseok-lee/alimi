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
          <SearchForm @search-results="handleSearchResults" />
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
            총 <strong>{{ results.length }}</strong>개의 지원금을 찾았습니다
          </p>
        </div>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <BenefitCard v-for="benefit in results" :key="benefit.id" :benefit="benefit" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchForm from '../components/SearchForm.vue'
import BenefitCard from '../components/BenefitCard.vue'
import type { BenefitResponse } from '../composables/useBenefitSearch'

// SEO 메타태그
useSeoMeta({
  title: '검색 결과 - 복지알리미',
  description: '맞춤형 정부 지원금 검색 결과를 확인하세요',
})

// 상태 관리
const results = ref<BenefitResponse[]>([])
const searchPerformed = ref(false)

// 검색 결과 핸들러
const handleSearchResults = (searchResults: BenefitResponse[]) => {
  results.value = searchResults
  searchPerformed.value = true
}
</script>
