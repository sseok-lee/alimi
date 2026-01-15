#!/usr/bin/env tsx

/**
 * 보조금24 데이터 동기화 스크립트
 *
 * 보조금24 API에서 서비스 목록과 지원조건을 가져와 DB에 동기화합니다.
 *
 * 사용법:
 *   npm run sync:benefits
 *
 * 동기화 전략 (하이브리드 - 옵션 B):
 *   1단계: serviceList + supportConditions 기본 동기화
 *   2단계: serviceDetail은 사용자가 상세 조회 시 온디맨드로 가져옴
 *
 * 예상 소요 시간: 약 20-30분 (10,924개 × 2 API)
 */

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import {
  fetchAllServiceList,
  fetchAllSupportConditions,
  ServiceListItem,
  SupportConditionItem,
  jaCodeToBoolean,
} from './gov24ApiClient.js';

// 환경변수 로드
dotenv.config();

const prisma = new PrismaClient();

// ===== 매핑 함수 =====

interface BenefitData {
  id: string;
  name: string;
  category: string;
  description: string | null;
  targetAudience: string | null;
  selectionCriteria: string | null;
  supportDetails: string | null;
  applicationMethod: string | null;
  applicationDeadline: string | null;
  organizationName: string | null;
  contactInfo: string | null;
  link: string;
  supportType: string | null;
  userType: string | null;
  applyAgency: string | null;
  viewCount: number | null;
  // supportConditions
  targetMale: boolean | null;
  targetFemale: boolean | null;
  minAge: number | null;
  maxAge: number | null;
  incomeLevel0to50: boolean | null;
  incomeLevel51to75: boolean | null;
  incomeLevel76to100: boolean | null;
  incomeLevel101to200: boolean | null;
  incomeLevelOver200: boolean | null;
  lifePregnancyPlan: boolean | null;
  lifePregnant: boolean | null;
  lifeBirth: boolean | null;
  lifeElementary: boolean | null;
  lifeMiddleSchool: boolean | null;
  lifeHighSchool: boolean | null;
  lifeUniversity: boolean | null;
  jobFarmer: boolean | null;
  jobFisherman: boolean | null;
  jobLivestock: boolean | null;
  jobForester: boolean | null;
  jobEmployee: boolean | null;
  jobSeeker: boolean | null;
  targetDisabled: boolean | null;
  targetVeteran: boolean | null;
  targetDisease: boolean | null;
  familyMulticultural: boolean | null;
  familyNKDefector: boolean | null;
  familySingleParent: boolean | null;
  familySinglePerson: boolean | null;
  familyMultiChild: boolean | null;
  familyNoHouse: boolean | null;
  familyNewResident: boolean | null;
  // 메타
  source: string;
  fetchedAt: Date;
}

/**
 * serviceList 항목을 Prisma 형식으로 변환
 */
function mapServiceListItem(item: ServiceListItem): Partial<BenefitData> {
  return {
    id: item.서비스ID,
    name: item.서비스명,
    category: item.서비스분야,
    description: item.서비스목적요약 || null,
    targetAudience: item.지원대상 || null,
    selectionCriteria: item.선정기준 || null,
    supportDetails: item.지원내용 || null,
    applicationMethod: item.신청방법 || null,
    applicationDeadline: item.신청기한 || null,
    organizationName: item.소관기관명 || null,
    contactInfo: item.전화문의 || null,
    link: item.상세조회URL,
    supportType: item.지원유형 || null,
    userType: item.사용자구분 || null,
    applyAgency: item.접수기관명 || null,
    viewCount: item.조회수 || null,
  };
}

/**
 * supportConditions 항목을 Prisma 형식으로 변환
 */
function mapSupportConditionItem(item: SupportConditionItem): Partial<BenefitData> {
  return {
    // 성별
    targetMale: jaCodeToBoolean(item.JA0101),
    targetFemale: jaCodeToBoolean(item.JA0102),
    // 연령
    minAge: item.JA0110 ?? null,
    maxAge: item.JA0111 ?? null,
    // 소득 수준
    incomeLevel0to50: jaCodeToBoolean(item.JA0201),
    incomeLevel51to75: jaCodeToBoolean(item.JA0202),
    incomeLevel76to100: jaCodeToBoolean(item.JA0203),
    incomeLevel101to200: jaCodeToBoolean(item.JA0204),
    incomeLevelOver200: jaCodeToBoolean(item.JA0205),
    // 생애주기
    lifePregnancyPlan: jaCodeToBoolean(item.JA0301),
    lifePregnant: jaCodeToBoolean(item.JA0302),
    lifeBirth: jaCodeToBoolean(item.JA0303),
    // 학생
    lifeElementary: jaCodeToBoolean(item.JA0317),
    lifeMiddleSchool: jaCodeToBoolean(item.JA0318),
    lifeHighSchool: jaCodeToBoolean(item.JA0319),
    lifeUniversity: jaCodeToBoolean(item.JA0320),
    // 직업
    jobFarmer: jaCodeToBoolean(item.JA0313),
    jobFisherman: jaCodeToBoolean(item.JA0314),
    jobLivestock: jaCodeToBoolean(item.JA0315),
    jobForester: jaCodeToBoolean(item.JA0316),
    jobEmployee: jaCodeToBoolean(item.JA0326),
    jobSeeker: jaCodeToBoolean(item.JA0327),
    // 특수 상황
    targetDisabled: jaCodeToBoolean(item.JA0328),
    targetVeteran: jaCodeToBoolean(item.JA0329),
    targetDisease: jaCodeToBoolean(item.JA0330),
    // 가족 상황
    familyMulticultural: jaCodeToBoolean(item.JA0401),
    familyNKDefector: jaCodeToBoolean(item.JA0402),
    familySingleParent: jaCodeToBoolean(item.JA0403),
    familySinglePerson: jaCodeToBoolean(item.JA0404),
    familyMultiChild: jaCodeToBoolean(item.JA0411),
    familyNoHouse: jaCodeToBoolean(item.JA0412),
    familyNewResident: jaCodeToBoolean(item.JA0413),
  };
}

// ===== 동기화 로직 =====

async function syncBenefits(): Promise<void> {
  const startTime = Date.now();
  console.log('========================================');
  console.log('보조금24 데이터 동기화 시작');
  console.log('========================================');
  console.log(`시작 시간: ${new Date().toLocaleString('ko-KR')}`);
  console.log('');

  try {
    // 1단계: 서비스 목록 조회
    console.log('[1/4] 서비스 목록 조회 중...');
    const serviceList = await fetchAllServiceList(1000, (page, total) => {
      process.stdout.write(`\r      페이지 ${page}/${total} 완료`);
    });
    console.log('');
    console.log(`      총 ${serviceList.length}개 서비스 조회 완료`);
    console.log('');

    // 2단계: 지원조건 조회
    console.log('[2/4] 지원조건 조회 중...');
    const supportConditions = await fetchAllSupportConditions(1000, (page, total) => {
      process.stdout.write(`\r      페이지 ${page}/${total} 완료`);
    });
    console.log('');
    console.log(`      총 ${supportConditions.length}개 지원조건 조회 완료`);
    console.log('');

    // 3단계: 지원조건을 Map으로 변환 (서비스ID → 조건)
    console.log('[3/4] 데이터 매핑 중...');
    const conditionMap = new Map<string, SupportConditionItem>();
    for (const condition of supportConditions) {
      conditionMap.set(condition.서비스ID, condition);
    }
    console.log(`      ${conditionMap.size}개 서비스에 지원조건 매핑됨`);
    console.log('');

    // 4단계: DB에 Upsert
    console.log('[4/4] DB 동기화 중...');
    const now = new Date();
    let created = 0;
    let updated = 0;
    let errors = 0;
    const batchSize = 100;
    const totalBatches = Math.ceil(serviceList.length / batchSize);

    for (let i = 0; i < serviceList.length; i += batchSize) {
      const batch = serviceList.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;

      process.stdout.write(`\r      배치 ${batchNum}/${totalBatches} 처리 중...`);

      for (const item of batch) {
        try {
          const serviceData = mapServiceListItem(item);
          const conditionData = conditionMap.has(item.서비스ID)
            ? mapSupportConditionItem(conditionMap.get(item.서비스ID)!)
            : {};

          const data = {
            ...serviceData,
            ...conditionData,
            source: 'gov24',
            fetchedAt: now,
          };

          // Prisma upsert
          const existing = await prisma.benefit.findUnique({
            where: { id: item.서비스ID },
            select: { id: true },
          });

          if (existing) {
            await prisma.benefit.update({
              where: { id: item.서비스ID },
              data,
            });
            updated++;
          } else {
            await prisma.benefit.create({
              data: data as BenefitData,
            });
            created++;
          }
        } catch (err) {
          errors++;
          console.error(`\n      오류 (서비스ID: ${item.서비스ID}):`, err);
        }
      }
    }

    console.log('');
    console.log(`      생성: ${created}, 업데이트: ${updated}, 오류: ${errors}`);
    console.log('');

    // 완료
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000 / 60).toFixed(2);

    console.log('========================================');
    console.log('동기화 완료!');
    console.log('========================================');
    console.log(`종료 시간: ${new Date().toLocaleString('ko-KR')}`);
    console.log(`소요 시간: ${duration}분`);
    console.log(`총 처리: ${created + updated}개 (생성: ${created}, 업데이트: ${updated})`);
    if (errors > 0) {
      console.log(`오류 발생: ${errors}개`);
    }
  } catch (error) {
    console.error('동기화 중 오류 발생:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
syncBenefits()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('치명적 오류:', error);
    process.exit(1);
  });
