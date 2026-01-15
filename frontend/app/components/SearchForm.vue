<template>
  <div class="search-form-container">
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- 생년월일 입력 -->
      <div>
        <label for="search-birthdate" class="block text-sm font-medium text-gray-700 mb-2">
          생년월일
        </label>
        <input
          id="search-birthdate"
          v-model="formData.birthDate"
          type="date"
          name="birthdate"
          required
          :max="maxDate"
          :min="minDate"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="calculatedAge !== null" class="mt-2 text-sm text-gray-600">
          만 {{ calculatedAge }}세
        </p>
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
      <div v-if="props.error" class="error-message text-red-600 text-sm">
        {{ props.error }}
      </div>

      <!-- 검색 버튼 -->
      <button
        type="submit"
        :disabled="props.loading"
        class="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{ loading: props.loading }"
      >
        <span v-if="props.loading">검색 중...</span>
        <span v-else>검색하기</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
  'submit': [params: {
    age: number
    income: number
    region: string
    category?: string
    lifePregnancy?: boolean
    targetDisabled?: boolean
    familySingleParent?: boolean
    familyMultiChild?: boolean
  }]
}>()

const props = defineProps<{
  loading?: boolean
  error?: string | null
}>()

const formData = ref<{
  birthDate: string
  income: string | number
  region: string
  category: string
  lifePregnancy: boolean
  targetDisabled: boolean
  familySingleParent: boolean
  familyMultiChild: boolean
}>({
  birthDate: '',
  income: '',
  region: '',
  category: '',
  lifePregnancy: false,
  targetDisabled: false,
  familySingleParent: false,
  familyMultiChild: false,
})

// 날짜 범위 설정
const today = new Date()
const maxDate = computed(() => {
  return today.toISOString().split('T')[0]
})
const minDate = computed(() => {
  const min = new Date(today.getFullYear() - 150, today.getMonth(), today.getDate())
  return min.toISOString().split('T')[0]
})

// 만 나이 계산
const calculatedAge = computed(() => {
  if (!formData.value.birthDate) return null

  const birthDate = new Date(formData.value.birthDate)
  const today = new Date()

  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  // 생일이 아직 안 지났으면 1살 빼기
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
})

const categories = [
  { value: '', label: '전체' },
  { value: '생활안정', label: '생활안정' },
  { value: '보육·교육', label: '보육·교육' },
  { value: '보건·의료', label: '보건·의료' },
  { value: '임신·출산', label: '임신·출산' },
  { value: '고용·창업', label: '고용·창업' },
  { value: '주거·자립', label: '주거·자립' },
  { value: '보호·돌봄', label: '보호·돌봄' },
  { value: '문화·환경', label: '문화·환경' },
  { value: '행정·안전', label: '행정·안전' },
  { value: '농림축산어업', label: '농림축산어업' },
]

const handleSubmit = () => {
  // 폼 검증
  if (calculatedAge.value === null || formData.value.income === '' || !formData.value.region) {
    return
  }

  const searchParams: {
    age: number
    income: number
    region: string
    category?: string
    lifePregnancy?: boolean
    targetDisabled?: boolean
    familySingleParent?: boolean
    familyMultiChild?: boolean
  } = {
    age: calculatedAge.value,
    income: Number(formData.value.income),
    region: formData.value.region,
  }

  // 카테고리 필터 (값이 있을 때만)
  if (formData.value.category) {
    searchParams.category = formData.value.category
  }

  // 대상조건 필터 (체크된 것만)
  if (formData.value.lifePregnancy) {
    searchParams.lifePregnancy = true
  }
  if (formData.value.targetDisabled) {
    searchParams.targetDisabled = true
  }
  if (formData.value.familySingleParent) {
    searchParams.familySingleParent = true
  }
  if (formData.value.familyMultiChild) {
    searchParams.familyMultiChild = true
  }

  console.log('검색 파라미터:', searchParams)

  // 검색 파라미터를 부모 컴포넌트에 emit
  emit('submit', searchParams)
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
