import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import type { Benefit } from '@prisma/client';
import { fetchBenefits } from '../../src/services/publicApiClient';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('PublicApiClient - TDD RED Phase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    process.env.USE_MOCK_API = 'false';
    process.env.PUBLIC_API_BASE_URL = 'https://test-api.example.com';
    process.env.API_TIMEOUT = '10000';
    process.env.API_MAX_RETRIES = '3';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Test 1: Happy Path - Successful API Call', () => {
    it('should fetch and normalize benefits from public API', async () => {
      // Mock external API response format
      const mockExternalResponse = {
        data: {
          items: [
            {
              id: 'ext-001',
              title: '청년도약계좌',
              type: '금융지원',
              description: '청년 자산형성 지원',
              estimated_amount: '5,000만원',
              eligibility: ['19~34세', '연소득 7,500만원 이하'],
              url: 'https://example.com/benefit1',
              min_age: 19,
              max_age: 34,
              min_income: null,
              max_income: 75000000,
              region: '전국',
            },
            {
              id: 'ext-002',
              title: '청년내일채움공제',
              type: '취업지원',
              description: '중소기업 재직 청년 지원',
              estimated_amount: '1,200만원',
              eligibility: ['15~34세', '중소기업 재직'],
              url: 'https://example.com/benefit2',
              min_age: 15,
              max_age: 34,
              min_income: null,
              max_income: null,
              region: '전국',
            },
          ],
        },
      };

      // Setup axios mock
      const mockGet = vi.fn().mockResolvedValue(mockExternalResponse);
      mockedAxios.create.mockReturnValue({
        get: mockGet,
      } as any);

      // Execute
      const benefits = await fetchBenefits();

      // Assertions
      expect(benefits).toBeInstanceOf(Array);
      expect(benefits).toHaveLength(2);

      // Verify normalization to Prisma Benefit schema
      const firstBenefit = benefits[0];
      expect(firstBenefit).toHaveProperty('id');
      expect(firstBenefit).toHaveProperty('name', '청년도약계좌');
      expect(firstBenefit).toHaveProperty('category', '금융지원');
      expect(firstBenefit).toHaveProperty('description', '청년 자산형성 지원');
      expect(firstBenefit).toHaveProperty('estimatedAmount', '5,000만원');
      expect(firstBenefit).toHaveProperty('link', 'https://example.com/benefit1');
      expect(firstBenefit).toHaveProperty('minAge', 19);
      expect(firstBenefit).toHaveProperty('maxAge', 34);
      expect(firstBenefit).toHaveProperty('maxIncome', 75000000);
      expect(firstBenefit).toHaveProperty('region', '전국');
      expect(firstBenefit).toHaveProperty('source', 'public-api');
      expect(firstBenefit).toHaveProperty('fetchedAt');
      expect(firstBenefit.fetchedAt).toBeInstanceOf(Date);

      // Verify API call
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://test-api.example.com',
          timeout: 10000,
        })
      );
      expect(mockGet).toHaveBeenCalledWith('/benefits');
    });
  });

  describe('Test 2: Error Handling - Network Timeout', () => {
    it('should throw error after 10 seconds timeout', async () => {
      const mockGet = vi.fn().mockRejectedValue({
        code: 'ECONNABORTED',
        message: 'timeout of 10000ms exceeded',
      });

      mockedAxios.create.mockReturnValue({
        get: mockGet,
      } as any);

      await expect(fetchBenefits()).rejects.toThrow();

      // Should have attempted max retries (3 times)
      expect(mockGet).toHaveBeenCalledTimes(3);
    });
  });

  describe('Test 3: Error Handling - Invalid Response Format', () => {
    it('should handle invalid response format gracefully', async () => {
      const mockInvalidResponse = {
        data: null, // Invalid: missing items array
      };

      const mockGet = vi.fn().mockResolvedValue(mockInvalidResponse);
      mockedAxios.create.mockReturnValue({
        get: mockGet,
      } as any);

      await expect(fetchBenefits()).rejects.toThrow('Invalid API response format');
    });

    it('should handle malformed benefit data', async () => {
      const mockMalformedResponse = {
        data: {
          items: [
            {
              // Missing required fields: title, type, url
              id: 'incomplete-001',
            },
          ],
        },
      };

      const mockGet = vi.fn().mockResolvedValue(mockMalformedResponse);
      mockedAxios.create.mockReturnValue({
        get: mockGet,
      } as any);

      const benefits = await fetchBenefits();

      // Should normalize with default values
      expect(benefits).toHaveLength(1);
      expect(benefits[0].name).toBe('제목 없음');
      expect(benefits[0].category).toBe('기타');
      expect(benefits[0].link).toBe('');
    });
  });

  describe('Test 4: Retry Logic - 5xx Server Errors', () => {
    it('should retry 3 times on 5xx errors before giving up', async () => {
      const mockGet = vi
        .fn()
        .mockRejectedValueOnce({ response: { status: 503 } }) // 1st attempt fails
        .mockRejectedValueOnce({ response: { status: 502 } }) // 2nd attempt fails
        .mockRejectedValueOnce({ response: { status: 500 } }); // 3rd attempt fails

      mockedAxios.create.mockReturnValue({
        get: mockGet,
      } as any);

      await expect(fetchBenefits()).rejects.toThrow();

      expect(mockGet).toHaveBeenCalledTimes(3);
    });

    it('should succeed on retry if server recovers', async () => {
      const mockSuccessResponse = {
        data: {
          items: [
            {
              id: 'retry-success-001',
              title: 'Retry Test Benefit',
              type: '테스트',
              url: 'https://example.com/retry',
            },
          ],
        },
      };

      const mockGet = vi
        .fn()
        .mockRejectedValueOnce({ response: { status: 503 } }) // 1st fails
        .mockResolvedValueOnce(mockSuccessResponse); // 2nd succeeds

      mockedAxios.create.mockReturnValue({
        get: mockGet,
      } as any);

      const benefits = await fetchBenefits();

      expect(benefits).toHaveLength(1);
      expect(benefits[0].name).toBe('Retry Test Benefit');
      expect(mockGet).toHaveBeenCalledTimes(2); // Only called twice
    });
  });

  describe('Test 5: Response Normalization - External → Prisma Schema', () => {
    it('should normalize various external field names to Prisma schema', async () => {
      const mockVariedResponse = {
        data: {
          items: [
            {
              // Variant 1: title → name
              id: 'var-001',
              title: 'Benefit with title field',
              type: '금융지원',
              url: 'https://example.com/1',
            },
            {
              // Variant 2: name field (already matches)
              id: 'var-002',
              name: 'Benefit with name field',
              category: '취업지원', // category instead of type
              link: 'https://example.com/2', // link instead of url
            },
            {
              // Variant 3: Missing optional fields
              id: 'var-003',
              title: 'Minimal benefit',
              type: '기타',
              url: 'https://example.com/3',
              // No age/income fields
            },
          ],
        },
      };

      const mockGet = vi.fn().mockResolvedValue(mockVariedResponse);
      mockedAxios.create.mockReturnValue({
        get: mockGet,
      } as any);

      const benefits = await fetchBenefits();

      expect(benefits).toHaveLength(3);

      // Variant 1: title → name
      expect(benefits[0].name).toBe('Benefit with title field');
      expect(benefits[0].category).toBe('금융지원');
      expect(benefits[0].link).toBe('https://example.com/1');

      // Variant 2: already matching fields
      expect(benefits[1].name).toBe('Benefit with name field');
      expect(benefits[1].category).toBe('취업지원');
      expect(benefits[1].link).toBe('https://example.com/2');

      // Variant 3: optional fields should be null
      expect(benefits[2].name).toBe('Minimal benefit');
      expect(benefits[2].minAge).toBeNull();
      expect(benefits[2].maxAge).toBeNull();
      expect(benefits[2].minIncome).toBeNull();
      expect(benefits[2].maxIncome).toBeNull();

      // All should have required metadata
      benefits.forEach((benefit) => {
        expect(benefit).toHaveProperty('id');
        expect(benefit).toHaveProperty('source', 'public-api');
        expect(benefit).toHaveProperty('fetchedAt');
        expect(benefit.fetchedAt).toBeInstanceOf(Date);
        expect(benefit).toHaveProperty('createdAt');
        expect(benefit).toHaveProperty('updatedAt');
      });
    });
  });

  describe('Mock API Mode', () => {
    it('should return mock data when USE_MOCK_API is true', async () => {
      process.env.USE_MOCK_API = 'true';

      const benefits = await fetchBenefits();

      // Mock data should be returned without API call
      expect(benefits).toBeInstanceOf(Array);
      expect(benefits.length).toBeGreaterThan(0);
      expect(benefits[0]).toHaveProperty('source', 'mock');
      expect(mockedAxios.create).not.toHaveBeenCalled();
    });
  });
});
