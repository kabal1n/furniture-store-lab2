import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import furnitureRoutes from './routes/furniture'
import testRoutes from './test-routes'
import customModelRoutes from './routes/custom-model'
import authRoutes from './routes/auth'
import adminRoutes from './routes/admin'
import { setupSwagger } from './swagger' 

dotenv.config()

const app = express()

app.use(cookieParser());

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/furniture', furnitureRoutes)
app.use('/test', testRoutes)
app.use('/custom-model', customModelRoutes)
app.use(authRoutes)
app.use('/admin', adminRoutes)

app.get('/', (req, res) => {
  res.send('API работает!')
})

setupSwagger(app)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`)
})
