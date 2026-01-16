import prisma from '../lib/prisma.js';
import {
  fetchAllServiceList,
  fetchAllSupportConditions,
  jaCodeToBoolean,
  type ServiceListItem,
  type SupportConditionItem,
} from './gov24ApiClient.js';

/**
 * 보조금24 데이터 동기화 서비스
 *
 * 1. serviceList API로 전체 서비스 목록 조회
 * 2. supportConditions API로 지원조건 조회
 * 3. 데이터 병합 후 Prisma upsert로 DB 저장
 *
 * 실행: npm run sync:benefits
 */

const LOG_ENABLED = process.env.LOG_LEVEL !== 'silent';

/**
 * 보조금24 전체 데이터 동기화
 */
export async function syncAllBenefits(): Promise<void> {
  console.log('🔄 보조금24 데이터 동기화 시작...');
  const startTime = Date.now();

  try {
    // 1단계: 서비스 목록 조회
    console.log('\n📋 1단계: 서비스 목록 조회 중...');
    const serviceList = await fetchAllServiceList(1000, (page, totalPages) => {
      if (LOG_ENABLED) {
        console.log(`  서비스 목록: ${page}/${totalPages} 페이지`);
      }
    });
    console.log(`✓ 서비스 목록 조회 완료: ${serviceList.length}개`);

    // 2단계: 지원조건 조회
    console.log('\n📋 2단계: 지원조건 조회 중...');
    const supportConditions = await fetchAllSupportConditions(1000, (page, totalPages) => {
      if (LOG_ENABLED) {
        console.log(`  지원조건: ${page}/${totalPages} 페이지`);
      }
    });
    console.log(`✓ 지원조건 조회 완료: ${supportConditions.length}개`);

    // 3단계: 지원조건을 서비스ID로 인덱싱
    console.log('\n📋 3단계: 데이터 병합 중...');
    const conditionMap = new Map<string, SupportConditionItem>();
    for (const condition of supportConditions) {
      conditionMap.set(condition.서비스ID, condition);
    }
    console.log(`✓ 지원조건 인덱싱 완료`);

    // 4단계: DB에 저장
    console.log('\n📋 4단계: DB 저장 중...');
    let successCount = 0;
    let errorCount = 0;

    // 배치 처리 (100개씩)
    const batchSize = 100;
    for (let i = 0; i < serviceList.length; i += batchSize) {
      const batch = serviceList.slice(i, i + batchSize);

      const upsertPromises = batch.map((service) => {
        const condition = conditionMap.get(service.서비스ID);
        return upsertBenefit(service, condition);
      });

      const results = await Promise.allSettled(upsertPromises);

      for (const result of results) {
        if (result.status === 'fulfilled') {
          successCount++;
        } else {
          errorCount++;
          if (LOG_ENABLED) {
            console.error(`  ✗ 저장 실패: ${result.reason}`);
          }
        }
      }

      if (LOG_ENABLED) {
        const progress = Math.min(i + batchSize, serviceList.length);
        console.log(`  진행: ${progress}/${serviceList.length} (성공: ${successCount}, 실패: ${errorCount})`);
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ 동기화 완료!`);
    console.log(`   총 ${successCount}개 서비스 동기화됨 (실패: ${errorCount}개)`);
    console.log(`   소요 시간: ${duration}초`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`\n❌ 동기화 실패: ${errorMessage}`);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * 단일 서비스 upsert
 */
async function upsertBenefit(
  service: ServiceListItem,
  condition: SupportConditionItem | undefined
): Promise<void> {
  const data = {
    // serviceList 필드
    name: service.서비스명 || '제목 없음',
    category: service.서비스분야 || '기타',
    description: service.서비스목적요약 || null,
    targetAudience: service.지원대상 || null,
    selectionCriteria: service.선정기준 || null,
    supportDetails: service.지원내용 || null,
    applicationMethod: service.신청방법 || null,
    applicationDeadline: service.신청기한 || null,
    organizationName: service.소관기관명 || null,
    contactInfo: service.전화문의 || null,
    link: service.상세조회URL || '',
    supportType: service.지원유형 || null,
    userType: service.사용자구분 || null,
    applyAgency: service.접수기관명 || null,
    viewCount: service.조회수 || null,

    // supportConditions 필드 (있는 경우에만)
    ...(condition && {
      // 성별
      targetMale: jaCodeToBoolean(condition.JA0101),
      targetFemale: jaCodeToBoolean(condition.JA0102),
      // 연령
      minAge: condition.JA0110 ?? null,
      maxAge: condition.JA0111 ?? null,
      // 소득 수준
      incomeLevel0to50: jaCodeToBoolean(condition.JA0201),
      incomeLevel51to75: jaCodeToBoolean(condition.JA0202),
      incomeLevel76to100: jaCodeToBoolean(condition.JA0203),
      incomeLevel101to200: jaCodeToBoolean(condition.JA0204),
      incomeLevelOver200: jaCodeToBoolean(condition.JA0205),
      // 생애주기
      lifePregnancyPlan: jaCodeToBoolean(condition.JA0301),
      lifePregnant: jaCodeToBoolean(condition.JA0302),
      lifeBirth: jaCodeToBoolean(condition.JA0303),
      // 학생
      lifeElementary: jaCodeToBoolean(condition.JA0317),
      lifeMiddleSchool: jaCodeToBoolean(condition.JA0318),
      lifeHighSchool: jaCodeToBoolean(condition.JA0319),
      lifeUniversity: jaCodeToBoolean(condition.JA0320),
      // 직업
      jobFarmer: jaCodeToBoolean(condition.JA0313),
      jobFisherman: jaCodeToBoolean(condition.JA0314),
      jobLivestock: jaCodeToBoolean(condition.JA0315),
      jobForester: jaCodeToBoolean(condition.JA0316),
      jobEmployee: jaCodeToBoolean(condition.JA0326),
      jobSeeker: jaCodeToBoolean(condition.JA0327),
      // 특수 상황
      targetDisabled: jaCodeToBoolean(condition.JA0328),
      targetVeteran: jaCodeToBoolean(condition.JA0329),
      targetDisease: jaCodeToBoolean(condition.JA0330),
      // 가족 상황
      familyMulticultural: jaCodeToBoolean(condition.JA0401),
      familyNKDefector: jaCodeToBoolean(condition.JA0402),
      familySingleParent: jaCodeToBoolean(condition.JA0403),
      familySinglePerson: jaCodeToBoolean(condition.JA0404),
      familyMultiChild: jaCodeToBoolean(condition.JA0411),
      familyNoHouse: jaCodeToBoolean(condition.JA0412),
      familyNewResident: jaCodeToBoolean(condition.JA0413),
    }),

    // 메타데이터
    source: '보조금24',
    fetchedAt: new Date(),
    updatedAt: new Date(),
  };

  await prisma.benefit.upsert({
    where: { id: service.서비스ID },
    update: data,
    create: {
      id: service.서비스ID,
      ...data,
    },
  });
}

// CLI 실행: npm run sync:benefits
// 이 파일이 직접 실행되면 동기화 시작
syncAllBenefits()
  .then(() => {
    console.log('\n프로세스 종료 (성공)');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n프로세스 종료 (실패):', error);
    process.exit(1);
  });
