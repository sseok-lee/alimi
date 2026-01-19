import { describe, it, expect } from 'vitest';
import { extractRegionFromOrganization, REGION_CODES } from '../../src/constants/regions.js';

describe('extractRegionFromOrganization', () => {
  it('서울특별시에서 서울 추출', () => {
    expect(extractRegionFromOrganization('서울특별시 동대문구')).toBe('서울');
  });

  it('경기도에서 경기 추출', () => {
    expect(extractRegionFromOrganization('경기도 수원시')).toBe('경기');
  });

  it('부산광역시에서 부산 추출', () => {
    expect(extractRegionFromOrganization('부산광역시 해운대구')).toBe('부산');
  });

  it('강원특별자치도에서 강원 추출', () => {
    expect(extractRegionFromOrganization('강원특별자치도 춘천시')).toBe('강원');
  });

  it('전북특별자치도에서 전북 추출', () => {
    expect(extractRegionFromOrganization('전북특별자치도 전주시')).toBe('전북');
  });

  it('중앙부처는 전국으로 처리', () => {
    expect(extractRegionFromOrganization('보건복지부')).toBe('전국');
    expect(extractRegionFromOrganization('교육부')).toBe('전국');
    expect(extractRegionFromOrganization('국토교통부')).toBe('전국');
  });

  it('null/undefined는 전국으로 처리', () => {
    expect(extractRegionFromOrganization(null)).toBe('전국');
    expect(extractRegionFromOrganization(undefined)).toBe('전국');
    expect(extractRegionFromOrganization('')).toBe('전국');
  });

  it('모든 17개 시/도 추출 확인', () => {
    const testCases = [
      { input: '서울특별시', expected: '서울' },
      { input: '부산광역시', expected: '부산' },
      { input: '대구광역시', expected: '대구' },
      { input: '인천광역시', expected: '인천' },
      { input: '광주광역시', expected: '광주' },
      { input: '대전광역시', expected: '대전' },
      { input: '울산광역시', expected: '울산' },
      { input: '세종특별자치시', expected: '세종' },
      { input: '경기도', expected: '경기' },
      { input: '강원특별자치도', expected: '강원' },
      { input: '충청북도', expected: '충북' },
      { input: '충청남도', expected: '충남' },
      { input: '전북특별자치도', expected: '전북' },
      { input: '전라남도', expected: '전남' },
      { input: '경상북도', expected: '경북' },
      { input: '경상남도', expected: '경남' },
      { input: '제주특별자치도', expected: '제주' },
    ];

    for (const { input, expected } of testCases) {
      expect(extractRegionFromOrganization(input)).toBe(expected);
    }
  });
});
