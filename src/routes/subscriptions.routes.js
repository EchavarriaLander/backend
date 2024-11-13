import { Router } from 'express'
import { getSubscriptionPlans, subscribeToPlan } from '../controllers/subscriptionPlans.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/subscription-plans', getSubscriptionPlans)
router.post('/subscribe', verifyToken, subscribeToPlan)

export default router 