import { fileURLToPath } from 'url';
import prisma from '../lib/prisma.js';
import { fetchGov24ServiceList, fetchGov24SupportConditions } from './publicApiClient.js';

/**
 * 보조금24 데이터 동기화 서비스
 * - 페이징으로 전체 서비스 목록 조회
 * - 각 서비스별 지원조건 조회
 * - Prisma upsert로 DB 저장
 * - Rate Limiting (1초 대기)
 */

const LOG_ENABLED = process.env.LOG_LEVEL !== 'silent';

/**
 * 소득 기준 텍스트를 숫자로 변환
 * 예: "7,500만원" → 75000000
 */
function parseIncomeString(incomeStr?: string): number | null {
  if (!incomeStr) return null;

  // 만원 단위 파싱
  const match = incomeStr.match(/(\d+,?\d*)\s*만원/);
  if (match) {
    const value = parseInt(match[1].replace(/,/g, ''), 10);
    return value * 10000;
  }

  // 억원 단위 파싱
  const matchBillion = incomeStr.match(/(\d+\.?\d*)\s*억/);
  if (matchBillion) {
    const value = parseFloat(matchBillion[1]);
    return Math.round(value * 100000000);
  }

  return null;
}

/**
 * 보조금24 전체 데이터 동기화
 */
export async function syncAllBenefits(): Promise<void> {
  console.log('🔄 보조금24 데이터 동기화 시작...');

  let totalSynced = 0;
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      if (LOG_ENABLED) {
        console.log(`\n📄 Page ${page} 조회 중...`);
      }

      // 서비스 목록 조회
      const response = await fetchGov24ServiceList({ page, perPage: 100 });

      if (!response.data || response.data.length === 0) {
        hasMore = false;
        break;
      }

      // 각 서비스별 처리
      for (const service of response.data) {
        try {
          // 지원조건 조회
          let condition = null;
          try {
            const conditionsResponse = await fetchGov24SupportConditions(service.서비스ID);
            condition = conditionsResponse.data?.[0] || null;
          } catch {
            if (LOG_ENABLED) {
              console.warn(`  ⚠️  지원조건 조회 실패: ${service.서비스ID}`);
            }
            // 지원조건이 없어도 서비스는 저장
          }

          // 소득 기준 파싱
          const parsedIncome = parseIncomeString(condition?.소득기준);

          // DB에 저장 (upsert)
          await prisma.benefit.upsert({
            where: { id: service.서비스ID },
            update: {
              name: service.서비스명 || '제목 없음',
              category: service.서비스분야 || '기타',
              description: service.서비스목적요약 || null,
              link: service.서비스상세URL || '',
              minAge: condition?.최소연령 ?? null,
              maxAge: condition?.최대연령 ?? null,
              minIncome: parsedIncome ? 0 : null, // 최소 소득은 0으로 설정
              maxIncome: parsedIncome,
              region: condition?.거주지역 || '전국',
              source: '보조금24',
              fetchedAt: new Date(),
              updatedAt: new Date(),
            },
            create: {
              id: service.서비스ID,
              name: service.서비스명 || '제목 없음',
              category: service.서비스분야 || '기타',
              description: service.서비스목적요약 || null,
              link: service.서비스상세URL || '',
              minAge: condition?.최소연령 ?? null,
              maxAge: condition?.최대연령 ?? null,
              minIncome: parsedIncome ? 0 : null,
              maxIncome: parsedIncome,
              region: condition?.거주지역 || '전국',
              source: '보조금24',
              fetchedAt: new Date(),
            },
          });

          totalSynced++;

          if (LOG_ENABLED) {
            console.log(`  ✓ ${service.서비스명} (${service.서비스ID})`);
          }

          // Rate limiting: 0.5초 대기 (지원조건 조회 시)
          if (condition) {
            await sleep(500);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(`  ✗ 저장 실패: ${service.서비스명} - ${errorMessage}`);
          // 개별 서비스 실패는 무시하고 계속 진행
        }
      }

      // 다음 페이지로
      hasMore = response.data.length === 100;
      page++;

      // Rate limiting: 페이지 간 1초 대기
      if (hasMore) {
        await sleep(1000);
      }
    }

    console.log(`\n✅ 동기화 완료! 총 ${totalSynced}개 서비스 동기화됨`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`\n❌ 동기화 실패: ${errorMessage}`);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * 지연 헬퍼 함수
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// CLI 실행 지원
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncAllBenefits()
    .then(() => {
      console.log('프로세스 종료 (성공)');
      process.exit(0);
    })
    .catch((error) => {
      console.error('프로세스 종료 (실패):', error);
      process.exit(1);
    });
}
