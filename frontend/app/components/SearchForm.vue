<template>
  <div class="search-form-container">
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- 나이 입력 -->
      <div>
        <label for="search-age" class="block text-sm font-medium text-gray-700 mb-2">
          나이
        </label>
        <input
          id="search-age"
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
        <label for="search-income" class="block text-sm font-medium text-gray-700 mb-2">
          소득
        </label>
        <select
          id="search-income"
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
        <label for="search-region" class="block text-sm font-medium text-gray-700 mb-2">
          지역
        </label>
        <select
          id="search-region"
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

      <!-- 카테고리 필터 -->
      <div>
        <label for="search-category" class="block text-sm font-medium text-gray-700 mb-2">
          카테고리 (선택)
        </label>
        <select
          id="search-category"
          v-model="formData.category"
          name="category"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">
            {{ cat.label }}
          </option>
        </select>
      </div>

      <!-- 대상 조건 필터 -->
      <div class="border-t border-gray-200 pt-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">
          대상 조건 (선택)
        </label>
        <div class="space-y-3">
          <label class="flex items-center cursor-pointer">
            <input
              v-model="formData.lifePregnancy"
              type="checkbox"
              class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span class="ml-3 text-sm text-gray-700">임신/출산</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              v-model="formData.targetDisabled"
              type="checkbox"
              class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span class="ml-3 text-sm text-gray-700">장애인</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              v-model="formData.familySingleParent"
              type="checkbox"
              class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span class="ml-3 text-sm text-gray-700">한부모/조손 가정</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              v-model="formData.familyMultiChild"
              type="checkbox"
              class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span class="ml-3 text-sm text-gray-700">다자녀 가구</span>
          </label>
        </div>
      </div>

      <!-- 에러 메시지 -->
      <div v-if="error" class="error-message text-red-600 text-sm">
        {{ error }}
      </div>

      <!-- 검색 버튼 -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{ loading: loading }"
      >
        <span v-if="loading">검색 중...</span>
        <span v-else>검색하기</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBenefitSearch } from '../composables/useBenefitSearch'

const emit = defineEmits<{
  'search-results': [results: any[]]
}>()

const { loading, error, search } = useBenefitSearch()

const formData = ref<{
  age: number | null
  income: string | number
  region: string
  category: string
  lifePregnancy: boolean
  targetDisabled: boolean
  familySingleParent: boolean
  familyMultiChild: boolean
}>({
  age: null,
  income: '',
  region: '',
  category: '',
  lifePregnancy: false,
  targetDisabled: false,
  familySingleParent: false,
  familyMultiChild: false,
})

const categories = [
  { value: '', label: '전체' },
  { value: '복지서비스', label: '복지서비스' },
  { value: '일자리', label: '일자리' },
  { value: '금융/저축', label: '금융/저축' },
  { value: '주거', label: '주거' },
  { value: '취업/고용', label: '취업/고용' },
  { value: '활동지원', label: '활동지원' },
]

const handleSubmit = async () => {
  // 폼 검증
  if (!formData.value.age || formData.value.income === '' || !formData.value.region) {
    return
  }

  try {
    const results = await search({
      age: formData.value.age,
      income: Number(formData.value.income),
      region: formData.value.region,
      category: formData.value.category || undefined,
      lifePregnancy: formData.value.lifePregnancy || undefined,
      targetDisabled: formData.value.targetDisabled || undefined,
      familySingleParent: formData.value.familySingleParent || undefined,
      familyMultiChild: formData.value.familyMultiChild || undefined,
    })

    // 검색 결과를 부모 컴포넌트에 emit
    emit('search-results', results)
  } catch (err) {
    // 에러는 useBenefitSearch에서 처리됨
  }
}
</script>

<style scoped>
.loading {
  position: relative;
}

.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  border: 2px solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}
</style>
