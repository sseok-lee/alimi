<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6">Mock API 테스트</h1>

    <!-- 검색 폼 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">서비스 검색</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"> 나이 </label>
          <input
            v-model.number="searchParams.age"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="예: 25"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"> 소득 (원) </label>
          <input
            v-model.number="searchParams.income"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="예: 30000000"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"> 지역 </label>
          <select
            v-model="searchParams.region"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체</option>
            <option value="전국">전국</option>
            <option value="서울">서울</option>
            <option value="경기">경기</option>
          </select>
        </div>
      </div>
      <button
        class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        :disabled="loading"
        @click="searchBenefits"
      >
        {{ loading ? '검색 중...' : '검색하기' }}
      </button>
    </div>

    <!-- 에러 메시지 -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-800">
        <strong>에러:</strong> {{ error }}
      </p>
    </div>

    <!-- 검색 결과 -->
    <div v-if="results" class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">
        검색 결과 (총 {{ results.total }}개)
      </h2>

      <!-- 검색 파라미터 표시 -->
      <div class="bg-gray-50 rounded-md p-3 mb-4 text-sm">
        <p><strong>검색 조건:</strong></p>
        <p v-if="results.searchParams.age">
          - 나이: {{ results.searchParams.age }}세
        </p>
        <p v-if="results.searchParams.income">
          - 소득: {{ formatCurrency(results.searchParams.income) }}원
        </p>
        <p v-if="results.searchParams.region">
          - 지역: {{ results.searchParams.region }}
        </p>
      </div>

      <!-- 서비스 목록 -->
      <div v-if="results.benefits.length > 0" class="space-y-4">
        <div
          v-for="benefit in results.benefits"
          :key="benefit.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <h3 class="text-lg font-semibold text-blue-600 mb-2">
            {{ benefit.name }}
          </h3>
          <p class="text-sm text-gray-500 mb-2">{{ benefit.category }}</p>
          <p class="text-gray-700 mb-3">{{ benefit.description }}</p>
          <div class="flex items-center justify-between">
            <span class="text-green-600 font-semibold">
              {{ benefit.estimatedAmount }}
            </span>
            <a
              :href="benefit.link"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:underline text-sm"
            >
              자세히 보기 →
            </a>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 py-8">
        검색 조건에 맞는 서비스이 없습니다.
      </div>
    </div>

    <!-- API 엔드포인트 테스트 -->
    <div class="mt-8 bg-gray-50 rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">API 엔드포인트 테스트</h2>
      <div class="space-y-2">
        <button
          class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-left"
          @click="testHealthEndpoint"
        >
          GET /api/health
        </button>
        <button
          class="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-left"
          @click="testCategoriesEndpoint"
        >
          GET /api/benefits/meta/categories
        </button>
        <button
          class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-left"
          @click="testRegionsEndpoint"
        >
          GET /api/benefits/meta/regions
        </button>
      </div>
      <pre
        v-if="apiTestResult"
        class="mt-4 bg-gray-800 text-green-400 p-4 rounded-md overflow-auto text-sm"
      >{{ apiTestResult }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  BenefitSearchRequest,
  SearchResultResponse,
} from '../../../../contracts/benefits.contract';

// 검색 파라미터
const searchParams = ref<BenefitSearchRequest>({
  age: undefined,
  income: undefined,
  region: undefined,
});

// 상태 관리
const loading = ref(false);
const error = ref<string | null>(null);
const results = ref<SearchResultResponse | null>(null);
const apiTestResult = ref<string | null>(null);

// 서비스 검색
const searchBenefits = async () => {
  loading.value = true;
  error.value = null;
  results.value = null;

  try {
    const params = new URLSearchParams();
    if (searchParams.value.age !== undefined) {
      params.append('age', searchParams.value.age.toString());
    }
    if (searchParams.value.income !== undefined) {
      params.append('income', searchParams.value.income.toString());
    }
    if (searchParams.value.region) {
      params.append('region', searchParams.value.region);
    }

    const response = await fetch(`/api/benefits/search?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    results.value = await response.json();
  } catch (err) {
    error.value = err instanceof Error ? err.message : '알 수 없는 에러';
  } finally {
    loading.value = false;
  }
};

// 헬스 체크 엔드포인트 테스트
const testHealthEndpoint = async () => {
  try {
    const response = await fetch('/api/health');
    const data = await response.json();
    apiTestResult.value = JSON.stringify(data, null, 2);
  } catch (err) {
    apiTestResult.value = `Error: ${err}`;
  }
};

// 카테고리 엔드포인트 테스트
const testCategoriesEndpoint = async () => {
  try {
    const response = await fetch('/api/benefits/meta/categories');
    const data = await response.json();
    apiTestResult.value = JSON.stringify(data, null, 2);
  } catch (err) {
    apiTestResult.value = `Error: ${err}`;
  }
};

// 지역 엔드포인트 테스트
const testRegionsEndpoint = async () => {
  try {
    const response = await fetch('/api/benefits/meta/regions');
    const data = await response.json();
    apiTestResult.value = JSON.stringify(data, null, 2);
  } catch (err) {
    apiTestResult.value = `Error: ${err}`;
  }
};

// 금액 포맷팅
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('ko-KR');
};

// SEO 메타 태그
useSeoMeta({
  title: 'Mock API 테스트 - 복지알리미',
  description: 'MSW Mock API 동작 테스트 페이지',
  robots: 'noindex, nofollow',
});
</script>
