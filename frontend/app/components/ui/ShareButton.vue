<template>
  <div class="relative" ref="containerRef">
    <!-- 공유 버튼 -->
    <button
      @click="handleClick"
      class="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-text-secondary rounded-xl text-sm font-medium transition-colors"
      aria-label="검색 결과 공유"
    >
      <span class="material-symbols-outlined text-lg">share</span>
      <span class="hidden sm:inline">공유</span>
    </button>

    <!-- 드롭다운 메뉴 (데스크톱) -->
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="showMenu"
        class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
      >
        <button
          @click="copyToClipboard"
          class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-gray-50 transition-colors"
        >
          <span class="material-symbols-outlined text-lg">content_copy</span>
          <span>{{ copySuccess ? '복사됨!' : 'URL 복사' }}</span>
        </button>
        <button
          @click="shareToTwitter"
          class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-gray-50 transition-colors"
        >
          <span class="material-symbols-outlined text-lg">open_in_new</span>
          <span>X (Twitter)</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { BenefitSearchRequest } from '../../composables/useBenefitSearch'
import { useShareUrl } from '../../composables/useShareUrl'

interface Props {
  searchParams: BenefitSearchRequest
  resultCount: number
}

const props = defineProps<Props>()

const { getShareUrl } = useShareUrl()

const containerRef = ref<HTMLElement | null>(null)
const showMenu = ref(false)
const copySuccess = ref(false)

// Web Share API 지원 여부 확인
const canUseWebShare = ref(false)

onMounted(() => {
  canUseWebShare.value = typeof navigator !== 'undefined' && !!navigator.share
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 외부 클릭 시 드롭다운 닫기
function handleClickOutside(event: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    showMenu.value = false
  }
}

// 버튼 클릭 핸들러
async function handleClick() {
  // 모바일에서 Web Share API 사용
  if (canUseWebShare.value) {
    try {
      const shareUrl = getShareUrl(props.searchParams)
      await navigator.share({
        title: `${props.searchParams.region} ${props.searchParams.age}세 지원금 검색`,
        text: `${props.searchParams.region} 지역, 만 ${props.searchParams.age}세 대상 정부 지원금 ${props.resultCount}건을 찾았습니다!`,
        url: shareUrl,
      })
      return
    } catch (err) {
      // 사용자가 취소했거나 에러 발생 시 드롭다운 표시
      if ((err as Error).name === 'AbortError') {
        return // 사용자 취소
      }
    }
  }

  // 데스크톱에서 드롭다운 토글
  showMenu.value = !showMenu.value
}

// 클립보드 복사
async function copyToClipboard() {
  try {
    const shareUrl = getShareUrl(props.searchParams)
    await navigator.clipboard.writeText(shareUrl)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
      showMenu.value = false
    }, 1500)
  } catch {
    // 클립보드 API 미지원 시 fallback
    const shareUrl = getShareUrl(props.searchParams)
    const textarea = document.createElement('textarea')
    textarea.value = shareUrl
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
      showMenu.value = false
    }, 1500)
  }
}

// Twitter 공유
function shareToTwitter() {
  const shareUrl = getShareUrl(props.searchParams)
  const text = `${props.searchParams.region} ${props.searchParams.age}세 대상 정부 지원금 ${props.resultCount}건을 찾았습니다! #복지알리미`
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`
  window.open(twitterUrl, '_blank', 'noopener,noreferrer')
  showMenu.value = false
}
</script>
