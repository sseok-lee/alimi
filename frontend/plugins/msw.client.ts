/**
 * MSW (Mock Service Worker) 플러그인
 *
 * 개발 환경에서만 MSW를 활성화하여 API를 모킹합니다.
 * 클라이언트 사이드에서만 실행됩니다 (.client.ts).
 */

export default defineNuxtPlugin(async () => {
  // 개발 환경에서만 MSW 활성화
  if (process.dev) {
    const { worker } = await import('~/mocks/browser');

    await worker.start({
      // 처리되지 않은 요청은 그대로 통과시킴
      onUnhandledRequest: 'bypass',
      // Service Worker 등록 시 콘솔 로그 비활성화 (선택사항)
      quiet: false,
    });
  }
});
