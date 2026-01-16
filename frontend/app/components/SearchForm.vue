<template>
  <div class="search-form-container">
    <form class="space-y-5" @submit.prevent="handleSubmit">
      <!-- 생년월일 입력 -->
      <div>
        <label class="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
          <span class="material-symbols-outlined text-primary text-xl">cake</span>
          생년월일
          <span v-if="calculatedAge !== null" class="text-primary font-bold">
            (만 {{ calculatedAge }}세)
          </span>
        </label>
        <div class="grid grid-cols-3 gap-2">
          <select
            v-model.number="formData.birthYear"
            required
            class="h-14 px-3 border border-gray-200 rounded-xl text-base font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="" disabled>년도</option>
            <option v-for="year in yearOptions" :key="year" :value="year">
              {{ year }}년
            </option>
          </select>
          <select
            v-model.number="formData.birthMonth"
            required
            class="h-14 px-3 border border-gray-200 rounded-xl text-base font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="" disabled>월</option>
            <option v-for="month in 12" :key="month" :value="month">
              {{ month }}월
            </option>
          </select>
          <select
            v-model.number="formData.birthDay"
            required
            class="h-14 px-3 border border-gray-200 rounded-xl text-base font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="" disabled>일</option>
            <option v-for="day in daysInMonth" :key="day" :value="day">
              {{ day }}일
            </option>
          </select>
        </div>
      </div>

      <!-- 소득 선택 -->
      <div>
        <label for="search-income" class="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
          <span class="material-symbols-outlined text-primary text-xl">payments</span>
          소득
        </label>
        <select
          id="search-income"
          v-model.number="formData.income"
          name="income"
          required
          class="w-full h-14 px-4 border border-gray-200 rounded-xl text-base font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
        <label for="search-region" class="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
          <span class="material-symbols-outlined text-primary text-xl">location_on</span>
          지역
        </label>
        <select
          id="search-region"
          v-model="formData.region"
          name="region"
          required
          class="w-full h-14 px-4 border border-gray-200 rounded-xl text-base font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
        <label for="search-category" class="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
          <span class="material-symbols-outlined text-primary text-xl">category</span>
          카테고리 (선택)
        </label>
        <select
          id="search-category"
          v-model="formData.category"
          name="category"
          class="w-full h-14 px-4 border border-gray-200 rounded-xl text-base font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        >
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">
            {{ cat.label }}
          </option>
        </select>
      </div>

      <!-- 대상 필터 -->
      <div class="border-t border-gray-100 pt-5">
        <label class="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
          <span class="material-symbols-outlined text-primary text-xl">person</span>
          대상 (선택)
        </label>
        <div class="grid grid-cols-2 gap-3">
          <label class="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all" :class="{ 'border-primary bg-primary/5': formData.lifePregnancy }">
            <input
              v-model="formData.lifePregnancy"
              type="checkbox"
              class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary/20"
            />
            <span class="text-sm text-text-primary">임신/출산</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all" :class="{ 'border-primary bg-primary/5': formData.targetDisabled }">
            <input
              v-model="formData.targetDisabled"
              type="checkbox"
              class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary/20"
            />
            <span class="text-sm text-text-primary">장애인</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all" :class="{ 'border-primary bg-primary/5': formData.familySingleParent }">
            <input
              v-model="formData.familySingleParent"
              type="checkbox"
              class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary/20"
            />
            <span class="text-sm text-text-primary">한부모/조손</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all" :class="{ 'border-primary bg-primary/5': formData.familyMultiChild }">
            <input
              v-model="formData.familyMultiChild"
              type="checkbox"
              class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary/20"
            />
            <span class="text-sm text-text-primary">다자녀</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all" :class="{ 'border-primary bg-primary/5': formData.jobSeeker }">
            <input
              v-model="formData.jobSeeker"
              type="checkbox"
              class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary/20"
            />
            <span class="text-sm text-text-primary">구직자/실업자</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all" :class="{ 'border-primary bg-primary/5': formData.lifeUniversity }">
            <input
              v-model="formData.lifeUniversity"
              type="checkbox"
              class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary/20"
            />
            <span class="text-sm text-text-primary">대학생/대학원생</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all" :class="{ 'border-primary bg-primary/5': formData.familySinglePerson }">
            <input
              v-model="formData.familySinglePerson"
              type="checkbox"
              class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary/20"
            />
            <span class="text-sm text-text-primary">1인가구</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all" :class="{ 'border-primary bg-primary/5': formData.familyNoHouse }">
            <input
              v-model="formData.familyNoHouse"
              type="checkbox"
              class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary/20"
            />
            <span class="text-sm text-text-primary">무주택세대</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all" :class="{ 'border-primary bg-primary/5': formData.jobEmployee }">
            <input
              v-model="formData.jobEmployee"
              type="checkbox"
              class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary/20"
            />
            <span class="text-sm text-text-primary">근로자/직장인</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all" :class="{ 'border-primary bg-primary/5': formData.targetVeteran }">
            <input
              v-model="formData.targetVeteran"
              type="checkbox"
              class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary/20"
            />
            <span class="text-sm text-text-primary">국가보훈대상자</span>
          </label>
        </div>
      </div>

      <!-- 지원 유형 필터 -->
      <div class="border-t border-gray-100 pt-5">
        <label for="search-support-type" class="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
          <span class="material-symbols-outlined text-primary text-xl">card_giftcard</span>
          지원 유형 (선택)
        </label>
        <select
          id="search-support-type"
          v-model="formData.supportType"
          name="supportType"
          class="w-full h-14 px-4 border border-gray-200 rounded-xl text-base font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        >
          <option value="">전체</option>
          <option value="현금">현금</option>
          <option value="현물">현물</option>
          <option value="서비스">서비스</option>
          <option value="이용권">이용권</option>
          <option value="감면">감면</option>
        </select>
      </div>

      <!-- 신청 조건 필터 -->
      <div class="border-t border-gray-100 pt-5">
        <label class="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
          <span class="material-symbols-outlined text-primary text-xl">check_circle</span>
          신청 조건 (선택)
        </label>
        <div class="grid grid-cols-2 gap-3">
          <label class="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all" :class="{ 'border-primary bg-primary/5': formData.onlineApplyAvailable }">
            <input
              v-model="formData.onlineApplyAvailable"
              type="checkbox"
              class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary/20"
            />
            <span class="text-sm text-text-primary">온라인 신청 가능</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all" :class="{ 'border-primary bg-primary/5': formData.alwaysOpen }">
            <input
              v-model="formData.alwaysOpen"
              type="checkbox"
              class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary/20"
            />
            <span class="text-sm text-text-primary">상시 신청</span>
          </label>
        </div>
      </div>

      <!-- 정렬 옵션 -->
      <div class="border-t border-gray-100 pt-5">
        <label for="search-sort" class="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
          <span class="material-symbols-outlined text-primary text-xl">sort</span>
          정렬 (선택)
        </label>
        <select
          id="search-sort"
          v-model="formData.sortBy"
          name="sortBy"
          class="w-full h-14 px-4 border border-gray-200 rounded-xl text-base font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        >
          <option value="">기본 정렬</option>
          <option value="latest">최신순</option>
          <option value="popular">인기순</option>
        </select>
      </div>

      <!-- 에러 메시지 -->
      <div v-if="props.error" class="flex items-center gap-2 p-3 bg-red-50 text-red-600 text-sm rounded-xl">
        <span class="material-symbols-outlined text-lg">error</span>
        {{ props.error }}
      </div>

      <!-- 검색 버튼 -->
      <button
        type="submit"
        :disabled="props.loading"
        class="w-full h-14 bg-primary hover:bg-primary-hover text-white text-lg font-bold rounded-xl shadow-lg shadow-primary/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] flex items-center justify-center gap-2"
      >
        <span v-if="props.loading" class="flex items-center gap-2">
          <span class="animate-spin material-symbols-outlined text-xl">progress_activity</span>
          검색 중...
        </span>
        <span v-else class="flex items-center gap-2">
          지원금 찾기
          <span class="material-symbols-outlined text-xl">arrow_forward</span>
        </span>
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
    lifeUniversity?: boolean
    targetDisabled?: boolean
    targetVeteran?: boolean
    jobSeeker?: boolean
    jobEmployee?: boolean
    familySingleParent?: boolean
    familyMultiChild?: boolean
    familySinglePerson?: boolean
    familyNoHouse?: boolean
    supportType?: string
    onlineApplyAvailable?: boolean
    alwaysOpen?: boolean
    sortBy?: 'latest' | 'popular'
  }]
}>()

const props = defineProps<{
  loading?: boolean
  error?: string | null
}>()

// 현재 연도
const currentYear = new Date().getFullYear()

// 연도 옵션 (현재 연도부터 100년 전까지)
const yearOptions = computed(() => {
  const years = []
  for (let y = currentYear; y >= currentYear - 100; y--) {
    years.push(y)
  }
  return years
})

const formData = ref({
  birthYear: '' as string | number,
  birthMonth: '' as string | number,
  birthDay: '' as string | number,
  income: '' as string | number,
  region: '',
  category: '',
  lifePregnancy: false,
  lifeUniversity: false,
  targetDisabled: false,
  targetVeteran: false,
  jobSeeker: false,
  jobEmployee: false,
  familySingleParent: false,
  familyMultiChild: false,
  familySinglePerson: false,
  familyNoHouse: false,
  supportType: '',
  onlineApplyAvailable: false,
  alwaysOpen: false,
  sortBy: '' as '' | 'latest' | 'popular',
})

// 해당 월의 일수 계산
const daysInMonth = computed(() => {
  if (!formData.value.birthYear || !formData.value.birthMonth) return 31
  const year = Number(formData.value.birthYear)
  const month = Number(formData.value.birthMonth)
  return new Date(year, month, 0).getDate()
})

const calculatedAge = computed(() => {
  if (!formData.value.birthYear || !formData.value.birthMonth || !formData.value.birthDay) return null

  const birthDate = new Date(
    Number(formData.value.birthYear),
    Number(formData.value.birthMonth) - 1,
    Number(formData.value.birthDay)
  )
  const today = new Date()

  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

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
  if (
    calculatedAge.value === null ||
    !formData.value.birthYear ||
    !formData.value.birthMonth ||
    !formData.value.birthDay ||
    formData.value.income === '' ||
    !formData.value.region
  ) {
    return
  }

  const searchParams: {
    age: number
    income: number
    region: string
    category?: string
    lifePregnancy?: boolean
    lifeUniversity?: boolean
    targetDisabled?: boolean
    targetVeteran?: boolean
    jobSeeker?: boolean
    jobEmployee?: boolean
    familySingleParent?: boolean
    familyMultiChild?: boolean
    familySinglePerson?: boolean
    familyNoHouse?: boolean
    supportType?: string
    onlineApplyAvailable?: boolean
    alwaysOpen?: boolean
    sortBy?: 'latest' | 'popular'
  } = {
    age: calculatedAge.value,
    income: Number(formData.value.income),
    region: formData.value.region,
  }

  if (formData.value.category) {
    searchParams.category = formData.value.category
  }

  if (formData.value.lifePregnancy) {
    searchParams.lifePregnancy = true
  }
  if (formData.value.lifeUniversity) {
    searchParams.lifeUniversity = true
  }
  if (formData.value.targetDisabled) {
    searchParams.targetDisabled = true
  }
  if (formData.value.targetVeteran) {
    searchParams.targetVeteran = true
  }
  if (formData.value.jobSeeker) {
    searchParams.jobSeeker = true
  }
  if (formData.value.jobEmployee) {
    searchParams.jobEmployee = true
  }
  if (formData.value.familySingleParent) {
    searchParams.familySingleParent = true
  }
  if (formData.value.familyMultiChild) {
    searchParams.familyMultiChild = true
  }
  if (formData.value.familySinglePerson) {
    searchParams.familySinglePerson = true
  }
  if (formData.value.familyNoHouse) {
    searchParams.familyNoHouse = true
  }
  if (formData.value.supportType) {
    searchParams.supportType = formData.value.supportType
  }
  if (formData.value.onlineApplyAvailable) {
    searchParams.onlineApplyAvailable = true
  }
  if (formData.value.alwaysOpen) {
    searchParams.alwaysOpen = true
  }
  if (formData.value.sortBy) {
    searchParams.sortBy = formData.value.sortBy
  }

  emit('submit', searchParams)
}
</script>

<style scoped>
/* 체크박스 커스텀 스타일 */
input[type="checkbox"]:checked {
  background-color: #3780f6;
  border-color: #3780f6;
}
</style>
