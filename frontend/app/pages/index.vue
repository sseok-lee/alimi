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
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- 나이 입력 -->
          <div>
            <label for="age" class="block text-sm font-medium text-gray-700 mb-2">
              나이
            </label>
            <input
              id="age"
              v-model.number="formData.age"
              type="number"
              name="age"
              placeholder="예: 27"
              required
              min="0"
              max="150"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- 소득 선택 -->
          <div>
            <label for="income" class="block text-sm font-medium text-gray-700 mb-2">
              소득
            </label>
            <select
              id="income"
              v-model.number="formData.income"
              name="income"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="" disabled>소득을 선택하세요</option>
              <option :value="0">무소득</option>
              <option :value="20000000">저소득 (연 2천만원 이하)</option>
              <option :value="40000000">중소득 (연 2천~4천만원)</option>
              <option :value="75000000">중상소득 (연 4천~7천5백만원)</option>
              <option :value="100000000">고소득 (연 7천5백만원 이상)</option>
            </select>
          </div>

          <!-- 지역 선택 -->
          <div>
            <label for="region" class="block text-sm font-medium text-gray-700 mb-2">
              지역
            </label>
            <select
              id="region"
              v-model="formData.region"
              name="region"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="" disabled>지역을 선택하세요</option>
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="인천">인천</option>
              <option value="부산">부산</option>
              <option value="대구">대구</option>
              <option value="대전">대전</option>
              <option value="광주">광주</option>
              <option value="울산">울산</option>
              <option value="세종">세종</option>
              <option value="강원">강원</option>
              <option value="충북">충북</option>
              <option value="충남">충남</option>
              <option value="전북">전북</option>
              <option value="전남">전남</option>
              <option value="경북">경북</option>
              <option value="경남">경남</option>
              <option value="제주">제주</option>
              <option value="전국">전국</option>
            </select>
          </div>

          <!-- 제출 버튼 -->
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            지원금 찾기
          </button>
        </form>
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
import { ref } from 'vue'

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

const formData = ref({
  age: null as number | null,
  income: '' as string | number,
  region: '',
})

const handleSubmit = () => {
  // 폼 검증 (income은 0일 수 있으므로 !== ''로 확인)
  if (!formData.value.age || formData.value.income === '' || !formData.value.region) {
    return
  }

  // /search 페이지로 이동
  navigateTo('/search')
}
</script>
