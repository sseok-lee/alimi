import prisma from '../lib/prisma.js';
import { extractRegionFromOrganization } from '../constants/regions.js';

/**
 * 기존 데이터 지역 코드 마이그레이션 스크립트
 *
 * - organizationName 필드를 읽어서 region 필드 업데이트
 * - 배치 처리로 성능 최적화
 *
 * 실행: npm run migrate:regions
 */
async function migrateRegions() {
  console.log('🔄 기존 데이터 지역 코드 마이그레이션 시작...');

  const benefits = await prisma.benefit.findMany({
    select: { id: true, organizationName: true }
  });

  console.log(`총 ${benefits.length}개 레코드 처리 예정`);

  let updated = 0;
  const batchSize = 100;

  for (let i = 0; i < benefits.length; i += batchSize) {
    const batch = benefits.slice(i, i + batchSize);

    await Promise.all(batch.map(benefit => {
      const region = extractRegionFromOrganization(benefit.organizationName);
      return prisma.benefit.update({
        where: { id: benefit.id },
        data: { region }
      });
    }));

    updated += batch.length;
    console.log(`  진행: ${updated}/${benefits.length}`);
  }

  console.log(`✅ 마이그레이션 완료: ${updated}개 업데이트됨`);

  // 지역별 통계 출력
  const stats = await prisma.benefit.groupBy({
    by: ['region'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } }
  });

  console.log('\n📊 지역별 지원금 통계:');
  for (const stat of stats) {
    console.log(`  ${stat.region || '(미분류)'}: ${stat._count.id}개`);
  }

  await prisma.$disconnect();
}

migrateRegions().catch(console.error);
