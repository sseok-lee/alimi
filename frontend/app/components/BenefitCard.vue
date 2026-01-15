<template>
  <div class="benefit-card" @click="handleClick">
    <!-- 카테고리 배지 -->
    <div class="category-badge">{{ benefit.category }}</div>

    <!-- 지원금 이름 (H3) -->
    <h3 class="benefit-title">{{ benefit.name }}</h3>

    <!-- 예상 금액 (있을 경우) -->
    <p v-if="benefit.estimated_amount" class="estimated-amount">
      {{ benefit.estimated_amount }}
    </p>

    <!-- 설명 (있을 경우) -->
    <p v-if="benefit.description" class="description">
      {{ benefit.description }}
    </p>

    <!-- 자격 조건 -->
    <div class="eligibility-list">
      <span v-for="item in benefit.eligibility" :key="item" class="eligibility-item">
        {{ item }}
      </span>
    </div>

    <!-- 상세보기 버튼 -->
    <button type="button" class="link-button">
      상세보기 →
    </button>
  </div>
</template>

<script setup lang="ts">
import type { BenefitResponse } from '~/composables/useBenefitSearch'

const props = defineProps<{
  benefit: BenefitResponse
}>()

const handleClick = () => {
  navigateTo(`/benefits/${props.benefit.id}`)
}
</script>

<style scoped>
.benefit-card {
  /* 디자인 시스템 준수 */
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: box-shadow 150ms ease-out;
  cursor: pointer;
}

.benefit-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 카테고리 배지 */
.category-badge {
  display: inline-block;
  padding: 4px 8px;
  background-color: #dbeafe; /* Primary Light */
  color: #3b82f6; /* Primary */
  font-size: 14px;
  border-radius: 4px;
  margin-bottom: 8px;
}

/* 지원금 제목 */
.benefit-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

/* 예상 금액 */
.estimated-amount {
  font-size: 16px;
  font-weight: 500;
  color: #3b82f6;
  margin-bottom: 8px;
}

/* 설명 */
.description {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
  line-height: 1.5;
}

/* 자격 조건 리스트 */
.eligibility-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.eligibility-item {
  font-size: 14px;
  color: #6b7280;
  background-color: #f9fafb;
  padding: 4px 8px;
  border-radius: 4px;
}

/* 링크 버튼 */
.link-button {
  display: inline-block;
  color: #3b82f6;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: text-decoration 150ms ease-out;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.link-button:hover {
  text-decoration: underline;
}

.link-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
