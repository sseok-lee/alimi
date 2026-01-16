import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

import benefitRoutes from './routes/benefits.js'
import healthRoutes from './routes/health.js'

// Load environment variables
dotenv.config()

const app: Express = express()

// CORS 설정 (쉼표로 구분된 여러 origin 지원)
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map(origin => origin.trim())

// Middlewares
app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    // origin이 없으면 (같은 origin 요청, curl 등) 허용
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS policy: ${origin} not allowed`))
    }
  },
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/health', healthRoutes)
app.use('/api/benefits', benefitRoutes)

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' })
})

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.message)
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

export default app
