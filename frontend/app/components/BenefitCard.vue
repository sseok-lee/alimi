<template>
  <div
    class="benefit-card group bg-white border border-gray-200 rounded-2xl p-5 h-full flex flex-col transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer"
    @click="handleCardClick"
  >
    <!-- 상단: 카테고리 배지 + 북마크 버튼 -->
    <div class="flex items-start justify-between mb-3">
      <!-- 카테고리 배지 -->
      <span
        class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full"
        :class="getCategoryBadgeClass(benefit.category)"
      >
        {{ benefit.category }}
      </span>

      <!-- 북마크 버튼 -->
      <button
        type="button"
        class="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        @click.stop="toggleBookmark"
        :aria-label="isBookmarked ? '북마크 해제' : '북마크 추가'"
      >
        <span
          class="material-symbols-outlined text-xl"
          :class="isBookmarked ? 'text-primary filled-icon' : 'text-gray-400'"
        >
          bookmark
        </span>
      </button>
    </div>

    <!-- 서비스 이름 -->
    <h3 class="font-display text-lg font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
      {{ benefit.name }}
    </h3>

    <!-- 예상 금액 -->
    <p v-if="benefit.estimated_amount" class="text-2xl font-black text-primary mb-3">
      {{ benefit.estimated_amount }}
    </p>

    <!-- 구분선 -->
    <div class="border-t border-dashed border-gray-200 my-3"></div>

    <!-- 설명 (체크 아이콘 포함) -->
    <div v-if="benefit.description" class="flex items-start gap-2 mb-3">
      <span class="material-symbols-outlined text-primary text-lg flex-shrink-0 mt-0.5">check_circle</span>
      <p class="text-sm text-text-secondary line-clamp-2">
        {{ benefit.description }}
      </p>
    </div>

    <!-- 자격 조건 태그 -->
    <div class="flex flex-wrap gap-2 mb-4 flex-grow">
      <span
        v-for="item in displayEligibility"
        :key="item"
        class="inline-flex items-center px-2.5 py-1 text-xs font-medium text-text-secondary bg-gray-50 rounded-lg"
      >
        {{ item }}
      </span>
      <span
        v-if="benefit.eligibility && benefit.eligibility.length > 3"
        class="inline-flex items-center px-2.5 py-1 text-xs font-medium text-primary bg-primary/5 rounded-lg"
      >
        +{{ benefit.eligibility.length - 3 }}개
      </span>
    </div>

    <!-- 하단: 상세보기 버튼 -->
    <div class="mt-auto pt-3 border-t border-gray-100">
      <button
        type="button"
        class="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 rounded-xl transition-colors"
        @click.stop="handleDetailClick"
      >
        상세보기
        <span class="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BenefitResponse } from '~/composables/useBenefitSearch'

const props = defineProps<{
  benefit: BenefitResponse
}>()

const emit = defineEmits<{
  'click': [benefit: BenefitResponse]
  'bookmark': [benefit: BenefitResponse, isBookmarked: boolean]
}>()

const isBookmarked = ref(false)

// 자격 조건 표시 (최대 3개)
const displayEligibility = computed(() => {
  if (!props.benefit.eligibility) return []
  return props.benefit.eligibility.slice(0, 3)
})

// 카테고리별 배지 색상 클래스
const getCategoryBadgeClass = (category: string): string => {
  const categoryMap: Record<string, string> = {
    '생활안정': 'bg-badge-finance-bg text-badge-finance-text border border-badge-finance-border',
    '보육·교육': 'bg-badge-education-bg text-badge-education-text border border-badge-education-border',
    '보건·의료': 'bg-badge-health-bg text-badge-health-text border border-badge-health-border',
    '임신·출산': 'bg-badge-culture-bg text-badge-culture-text border border-badge-culture-border',
    '고용·창업': 'bg-badge-employment-bg text-badge-employment-text border border-badge-employment-border',
    '주거·자립': 'bg-badge-housing-bg text-badge-housing-text border border-badge-housing-border',
    '보호·돌봄': 'bg-badge-transport-bg text-badge-transport-text border border-badge-transport-border',
    '문화·환경': 'bg-badge-culture-bg text-badge-culture-text border border-badge-culture-border',
    '행정·안전': 'bg-badge-finance-bg text-badge-finance-text border border-badge-finance-border',
    '농림축산어업': 'bg-badge-transport-bg text-badge-transport-text border border-badge-transport-border',
  }
  return categoryMap[category] || 'bg-gray-100 text-gray-600 border border-gray-200'
}

const handleCardClick = () => {
  emit('click', props.benefit)
}

const handleDetailClick = () => {
  emit('click', props.benefit)
}

const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value
  emit('bookmark', props.benefit, isBookmarked.value)
}
</script>

<style scoped>
/* line-clamp 유틸리티 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Material Symbols filled 스타일 */
.filled-icon {
  font-variation-settings: 'FILL' 1;
}
</style>
