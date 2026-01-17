// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  runtimeConfig: {
    public: {
      // API_BASE_URL 미설정 시 localhost:8000 (로컬 개발용)
      // GitHub Actions에서 API_BASE_URL='' 로 빌드 → 프로덕션에서 Nginx 프록시 사용
      apiBase: process.env.API_BASE_URL !== undefined ? process.env.API_BASE_URL : 'http://localhost:8000',
      gaId: process.env.NUXT_PUBLIC_GA_ID || '',
      // NUXT_PUBLIC_DISABLE_MSW=true로 설정하면 개발 환경에서도 MSW 비활성화
      disableMsw: process.env.NUXT_PUBLIC_DISABLE_MSW || false,
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'ko',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: '복지알리미 - 맞춤형 정부 지원금 검색',
      meta: [
        { name: 'description', content: '나이, 소득, 지역 3가지만 입력하면 당신을 위한 정부 지원금을 찾아드립니다. 청년도약계좌, 주거지원, 취업지원 등 다양한 복지 혜택을 한눈에 확인하세요.' },
        { name: 'keywords', content: '정부지원금, 복지혜택, 청년지원, 복지알리미, 지원금검색, 청년도약계좌, 주거지원, 취업지원' },
        { name: 'author', content: '복지알리미' },
        { name: 'robots', content: 'index, follow' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: '복지알리미' },
        { property: 'og:title', content: '복지알리미 - 맞춤형 정부 지원금 검색' },
        { property: 'og:description', content: '나이, 소득, 지역 3가지만 입력하면 당신을 위한 정부 지원금을 찾아드립니다.' },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:url', content: 'https://welfare-notifier.vercel.app' },
        { property: 'og:locale', content: 'ko_KR' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: '복지알리미 - 맞춤형 정부 지원금 검색' },
        { name: 'twitter:description', content: '나이, 소득, 지역 3가지만 입력하면 당신을 위한 정부 지원금을 찾아드립니다.' },
        { name: 'twitter:image', content: '/og-image.png' },

        // Mobile Web App
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: '복지알리미' },

        // Theme Color
        { name: 'theme-color', content: '#2563eb' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://welfare-notifier.vercel.app' },
        // Google Fonts - Manrope & Noto Sans KR
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;700&display=swap' },
        // Material Symbols
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap' },
      ],
    },
  },
})
