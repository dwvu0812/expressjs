// routes/index.ts
import express, { Router, Request, Response } from 'express'

const router: Router = express.Router()

// Định nghĩa các route
router.get('/', (req: Request, res: Response) => {
  res.send('Trang chủ')
})

router.get('/about', (req: Request, res: Response) => {
  res.send('Trang giới thiệu')
})

router.post('/contact', (req: Request, res: Response) => {
  // Xử lý request POST /contact
  res.send('Đã gửi liên hệ')
})

export default router
