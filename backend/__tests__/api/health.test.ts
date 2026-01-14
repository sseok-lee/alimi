import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../../src/app.js'

describe('Health API', () => {
  describe('GET /api/health', () => {
    it('헬스체크가 200 OK를 반환한다', async () => {
      const response = await request(app).get('/api/health')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('status', 'ok')
      expect(response.body).toHaveProperty('timestamp')
      expect(response.body).toHaveProperty('uptime')
    })
  })
})
