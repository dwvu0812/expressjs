// app.ts
import express, { Express } from 'express'
import loggerMiddleware from './middleware/logger'
import indexRoutes from './routes/index'
import userRoutes from './routes/users'
import databaseService from './services/database.service'

const app: Express = express()

// Sử dụng middleware
app.use(loggerMiddleware)

// Sử dụng các route
app.use('/', indexRoutes)
app.use('/api/users', userRoutes)

databaseService.connect().catch(console.dir)

// Khởi chạy server
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
