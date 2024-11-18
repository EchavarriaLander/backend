import { Router } from 'express'
import { createPayment, getPaymentHistory } from '../controllers/payments.controller.js'
import { authRequired } from '../middlewares/validateToken.js'

const router = Router()

router.post('/payments/create', authRequired, createPayment)
router.get('/payments/history', authRequired, getPaymentHistory)

export default router 