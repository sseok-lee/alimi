/**
 * Mock 지원금 데이터
 *
 * 실제 청년 지원금을 모사한 테스트 데이터입니다.
 * contracts/benefits.contract.ts의 BenefitResponse 타입과 일치합니다.
 */

import type { BenefitResponse } from '../../../../contracts/benefits.contract';

export const mockBenefits: BenefitResponse[] = [
  {
    id: 'benefit-001',
    name: '청년도약계좌',
    category: '금융/저축',
    description:
      '만 19~34세 청년의 자산 형성을 위한 정부 지원 저축 계좌. 월 최대 70만원까지 납입 시 정부에서 매칭 지원금을 제공합니다.',
    estimatedAmount: '월 최대 33만원 (5년간)',
    eligibility: {
      income: '개인소득 6,000만원 이하',
      age: '만 19~34세',
      savings: '월 70만원 이하 납입',
    },
    link: 'https://www.kinfa.or.kr/youth',
    minAge: 19,
    maxAge: 34,
    minIncome: 0,
    maxIncome: 60000000,
    region: '전국',
  },
  {
    id: 'benefit-002',
    name: '청년내일저축계좌',
    category: '금융/저축',
    description:
      '근로 취약 계층 청년의 자산 형성을 지원하는 저축 계좌. 본인이 월 10만원 저축 시 정부에서 월 30만원을 추가 지원합니다.',
    estimatedAmount: '월 30만원 (3년간)',
    eligibility: {
      income: '기준 중위소득 50% 이하 (생계·의료 수급자 제외)',
      work: '근로활동 참여 중',
    },
    link: 'https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00004278',
    minAge: 15,
    maxAge: 39,
    minIncome: 0,
    maxIncome: 12000000,
    region: '전국',
  },
  {
    id: 'benefit-003',
    name: '청년월세 한시 특별지원',
    category: '주거',
    description:
      '무주택 청년의 월세 부담을 덜어주는 지원금. 최대 12개월간 월 20만원씩 지급됩니다.',
    estimatedAmount: '월 20만원 (최대 12개월)',
    eligibility: {
      age: '만 19~34세',
      income: '기준 중위소득 60% 이하',
      housing: '임차 보증금 5천만원 이하, 월세 60만원 이하',
    },
    link: 'https://www.myhome.go.kr/hws/portal/cont/selectContPageView.do?srnContId=CONT_00003',
    minAge: 19,
    maxAge: 34,
    minIncome: 0,
    maxIncome: 18000000,
    region: '전국',
  },
  {
    id: 'benefit-004',
    name: '국민취업지원제도',
    category: '취업/고용',
    description:
      '취업 취약계층에게 구직활동 지원과 월 최대 50만원의 구직촉진수당을 제공합니다. 취업 성공 패키지 형태로 진행됩니다.',
    estimatedAmount: '월 최대 50만원 (6개월)',
    eligibility: {
      age: '만 15~69세',
      income: 'I유형: 중위소득 60% 이하, II유형: 소득요건 없음',
      work: '구직 의사 및 활동 참여 가능',
    },
    link: 'https://www.kua.go.kr/uapaa010/selectMainView.do',
    minAge: 15,
    maxAge: 69,
    minIncome: 0,
    maxIncome: 30000000,
    region: '전국',
  },
  {
    id: 'benefit-005',
    name: '청년 일자리 도약 장려금',
    category: '취업/고용',
    description:
      '중소·중견기업에 정규직으로 취업하는 청년에게 취업 장려금을 지급합니다. 1년간 총 300만원을 지원합니다.',
    estimatedAmount: '총 300만원 (1년간)',
    eligibility: {
      age: '만 15~34세',
      work: '중소·중견기업 정규직 취업',
    },
    link: 'https://www.work.go.kr/youthjump',
    minAge: 15,
    maxAge: 34,
    minIncome: 0,
    maxIncome: 999999999,
    region: '전국',
  },
  {
    id: 'benefit-006',
    name: '서울시 청년수당',
    category: '활동지원',
    description:
      '서울시 거주 청년에게 구직활동 및 자기개발 활동을 지원합니다. 월 50만원씩 최대 6개월간 지급됩니다.',
    estimatedAmount: '월 50만원 (6개월)',
    eligibility: {
      age: '만 19~34세',
      residence: '서울시 거주',
      income: '중위소득 150% 이하',
      activity: '구직활동 또는 자기개발 활동 참여',
    },
    link: 'https://youth.seoul.go.kr',
    minAge: 19,
    maxAge: 34,
    minIncome: 0,
    maxIncome: 45000000,
    region: '서울',
  },
  {
    id: 'benefit-007',
    name: '경기청년 기본소득',
    category: '활동지원',
    description:
      '경기도 거주 만 24세 청년에게 1년간 분기별 25만원씩 총 100만원을 지역화폐로 지급합니다.',
    estimatedAmount: '연 100만원',
    eligibility: {
      age: '만 24세',
      residence: '경기도 3년 이상 거주',
    },
    link: 'https://basicincome.gg.go.kr',
    minAge: 24,
    maxAge: 24,
    minIncome: 0,
    maxIncome: 999999999,
    region: '경기',
  },
  {
    id: 'benefit-008',
    name: '청년 내일채움공제',
    category: '금융/저축',
    description:
      '중소·중견기업 청년 근로자의 장기 근속과 목돈 마련을 지원합니다. 2년 만기 시 1,200만원, 3년 만기 시 최대 3,000만원을 수령할 수 있습니다.',
    estimatedAmount: '2년: 1,200만원 / 3년: 3,000만원',
    eligibility: {
      age: '만 15~34세',
      work: '중소·중견기업 정규직 근로자',
      period: '2년 또는 3년 근속',
    },
    link: 'https://www.sbcplan.or.kr',
    minAge: 15,
    maxAge: 34,
    minIncome: 0,
    maxIncome: 999999999,
    region: '전국',
  },
  {
    id: 'benefit-009',
    name: '청년 우대형 청약통장',
    category: '금융/저축',
    description:
      '무주택 청년의 내 집 마련을 위한 우대 금리 청약통장. 연 최대 3.3%의 우대 금리를 제공합니다.',
    estimatedAmount: '우대금리 연 3.3%',
    eligibility: {
      age: '만 19~34세',
      income: '연소득 3,600만원 이하',
      housing: '무주택 세대주',
    },
    link: 'https://www.hf.go.kr',
    minAge: 19,
    maxAge: 34,
    minIncome: 0,
    maxIncome: 36000000,
    region: '전국',
  },
  {
    id: 'benefit-010',
    name: '청년 전세보증금 대출',
    category: '주거',
    description:
      '무주택 청년의 전세 자금을 지원하는 저금리 대출 상품. 최대 1억원까지 연 1.2%의 우대금리로 대출 가능합니다.',
    estimatedAmount: '최대 1억원 (연 1.2% 금리)',
    eligibility: {
      age: '만 19~34세',
      income: '부부 합산 연소득 5,000만원 이하',
      housing: '무주택 세대주',
    },
    link: 'https://www.hf.go.kr',
    minAge: 19,
    maxAge: 34,
    minIncome: 0,
    maxIncome: 50000000,
    region: '전국',
  },
];
