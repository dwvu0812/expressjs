// routes/users.ts
import express, { Router, Request, Response } from 'express'

const userRouter: Router = express.Router()

userRouter.get('/', (req: Request, res: Response) => {
  res.send('Danh sách người dùng')
})

userRouter.post('/', (req: Request, res: Response) => {
  // Xử lý request POST /api/users
  res.send('Đã tạo người dùng mới')
})

export default userRouter
