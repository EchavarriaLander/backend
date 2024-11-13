import { Router } from 'express'
import { createPayment, getPaymentHistory } from '../controllers/payments.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/payments', verifyToken, createPayment)
router.get('/payments/history', verifyToken, getPaymentHistory)

export default router 