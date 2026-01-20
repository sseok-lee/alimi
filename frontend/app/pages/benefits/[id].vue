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
            <NuxtLink to="/search" class="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
              서비스 검색
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <main class="py-8 md:py-12">
      <div class="container mx-auto px-4">
        <!-- 로딩 상태 -->
        <div v-if="loading" class="text-center py-16">
          <div class="w-16 h-16 mx-auto mb-4">
            <span class="animate-spin material-symbols-outlined text-primary text-5xl">progress_activity</span>
          </div>
          <p class="text-text-secondary">로딩 중...</p>
        </div>

        <!-- 에러 상태 -->
        <div v-else-if="error" class="text-center py-16">
          <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span class="material-symbols-outlined text-red-500 text-4xl">error</span>
          </div>
          <h2 class="font-display text-xl font-bold text-text-primary mb-2">
            {{ error }}
          </h2>
          <p class="text-text-secondary mb-6">
            요청하신 서비스을 찾을 수 없습니다
          </p>
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <span class="material-symbols-outlined text-lg">home</span>
            홈으로 돌아가기
          </NuxtLink>
        </div>

        <!-- 성공 상태: 상세 정보 표시 -->
        <div v-else-if="benefit" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- 메인 컨텐츠 (8컬럼) -->
          <div class="lg:col-span-8 space-y-6">
            <!-- 히어로 섹션 -->
            <BenefitHero :benefit="benefit" />

            <!-- 자격 요건 -->
            <EligibilityCard
              :target-audience="benefit.targetAudience"
              :selection-criteria="benefit.selectionCriteria"
              :min-age="benefit.minAge"
              :max-age="benefit.maxAge"
              :min-income="benefit.minIncome"
              :max-income="benefit.maxIncome"
              :region="benefit.region"
            />

            <!-- 구비 서류 -->
            <DocumentsCard
              :documents="benefit.requiredDocuments"
              :official-confirm-docs="benefit.officialConfirmDocs"
              :identity-confirm-docs="benefit.identityConfirmDocs"
            />

            <!-- 관련 법령 -->
            <RelatedLawsCard v-if="benefit.relatedLaws" :related-laws="benefit.relatedLaws" />

            <!-- 신청 절차 -->
            <ProcessSteps
              :application-method="benefit.applicationMethod"
              :application-deadline="benefit.applicationDeadline"
              :link="benefit.link"
            />

            <!-- 관련 서비스 -->
            <RelatedBenefits :benefits="relatedBenefits" />
          </div>

          <!-- 사이드바 (4컬럼, Sticky) -->
          <aside class="lg:col-span-4 hidden lg:block">
            <div class="sticky top-24">
              <ApplySidebar
                :application-deadline="benefit.applicationDeadline"
                :link="benefit.link"
                :organization-name="benefit.organizationName"
                :apply-agency="benefit.applyAgency"
                :contact-info="benefit.contactInfo"
              />
            </div>
          </aside>
        </div>
      </div>
    </main>

    <!-- 모바일 하단 고정 바 (lg 이하에서만 표시) -->
    <MobileBottomBar v-if="benefit" :link="benefit.link" />

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
// 라우트 파라미터 가져오기
const route = useRoute()
const id = computed(() => Array.isArray(route.params.id) ? route.params.id[0] : route.params.id)

// Composable 사용 (SSR 지원 - useFetch 내부 사용)
const { loading, error, benefit, relatedBenefits } = useBenefitDetail(id)

// SEO 메타태그
useSeoMeta({
  title: () => (benefit.value ? `${benefit.value.name} - 복지알리미` : '복지알리미'),
  description: () => benefit.value?.description || '맞춤형 정부 서비스 검색 서비스',
  ogTitle: () => benefit.value?.name || '복지알리미',
  ogDescription: () => benefit.value?.supportDetails || benefit.value?.description || '',
})
</script>
