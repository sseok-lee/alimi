import { describe, it, expect, afterEach, afterAll } from 'vitest'
import request from 'supertest'
import app from '../../src/app.js'
import prisma from '../../src/lib/prisma.js'

describe('Benefits API', () => {
  describe('POST /api/benefits/search', () => {
    it('유효한 검색 조건으로 지원금 목록을 반환한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({
          age: 27,
          income: 3000,
          region: '서울'
        })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('benefits')
      expect(Array.isArray(response.body.benefits)).toBe(true)
      expect(response.body).toHaveProperty('total')
      expect(response.body).toHaveProperty('searchParams')
    })

    it('빈 검색 조건도 허용한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({})

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('benefits')
    })

    it('잘못된 나이 형식에 대해 422 에러를 반환한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({ age: 'invalid' })

      expect(response.status).toBe(422)
      expect(response.body).toHaveProperty('error', 'Validation Error')
    })

    it('음수 나이에 대해 422 에러를 반환한다', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({ age: -1 })

      expect(response.status).toBe(422)
    })
  })

  describe('GET /api/benefits/:id', () => {
    it('존재하지 않는 ID에 대해 404를 반환한다', async () => {
      const response = await request(app)
        .get('/api/benefits/non-existent-id')

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error', 'Benefit not found')
    })
  })

  describe('SearchLog recording', () => {
    afterEach(async () => {
      // Clean up SearchLog entries after each test
      await prisma.searchLog.deleteMany({})
    })

    afterAll(async () => {
      // Final cleanup
      await prisma.searchLog.deleteMany({})
    })

    it('POST /api/benefits/search - should record search log', async () => {
      const searchParams = {
        age: 27,
        income: 0,
        region: '서울'
      }

      const response = await request(app)
        .post('/api/benefits/search')
        .send(searchParams)
        .expect(200)

      // Verify SearchLog was created
      const logs = await prisma.searchLog.findMany({
        where: {
          age: 27,
          income: 0,
          region: '서울'
        },
        orderBy: { searchedAt: 'desc' },
        take: 1
      })

      expect(logs).toHaveLength(1)
      expect(logs[0].age).toBe(27)
      expect(logs[0].income).toBe(0)
      expect(logs[0].region).toBe('서울')
      expect(logs[0].resultCount).toBe(response.body.benefits.length)
      expect(logs[0].sessionId).toBeTruthy() // Should have some session ID
    })

    it('POST /api/benefits/search - should record log even with empty params', async () => {
      const response = await request(app)
        .post('/api/benefits/search')
        .send({})
        .expect(200)

      const logs = await prisma.searchLog.findMany({
        orderBy: { searchedAt: 'desc' },
        take: 1
      })

      expect(logs).toHaveLength(1)
      expect(logs[0].age).toBeNull()
      expect(logs[0].income).toBeNull()
      expect(logs[0].region).toBeNull()
      expect(logs[0].resultCount).toBe(response.body.benefits.length)
    })
  })
})
