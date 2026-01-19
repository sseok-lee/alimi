<template>
  <section class="py-16 md:py-20">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <span class="material-symbols-outlined text-primary text-lg">trending_up</span>
          <span class="text-sm font-semibold text-primary">실시간 인기</span>
        </div>
        <h2 class="font-display text-2xl md:text-3xl font-bold text-text-primary mb-3">
          지금 가장 인기있는 서비스
        </h2>
        <p class="text-text-secondary">
          많은 분들이 관심을 가지고 있는 서비스을 확인해보세요
        </p>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="flex justify-center py-12">
        <span class="animate-spin material-symbols-outlined text-primary text-4xl">progress_activity</span>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-outlined text-text-muted text-3xl">error_outline</span>
        </div>
        <p class="text-text-secondary">{{ error }}</p>
      </div>

      <!-- 서비스 카드 그리드 -->
      <div v-else-if="benefits.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <BenefitCard
          v-for="benefit in benefits"
          :key="benefit.id"
          :benefit="benefit"
          @click="handleCardClick"
        />
      </div>

      <!-- 데이터 없음 -->
      <div v-else class="text-center py-12">
        <p class="text-text-secondary">인기 서비스 정보가 없습니다.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BenefitCard from '~/components/BenefitCard.vue'
import { usePopularBenefits } from '~/composables/usePopularBenefits'
import type { BenefitResponse } from '~/composables/useBenefitSearch'

const { loading, error, benefits, fetchPopular } = usePopularBenefits()

onMounted(() => {
  fetchPopular(8)
})

const handleCardClick = (benefit: BenefitResponse) => {
  navigateTo(`/benefits/${benefit.id}`)
}
</script>
