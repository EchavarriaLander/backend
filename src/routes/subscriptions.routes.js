import { Router } from 'express'
import { getSubscriptionPlans, subscribeToPlan, getUserSubscription } from '../controllers/subscriptionPlans.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/subscription-plans', getSubscriptionPlans)
router.post('/subscribe', verifyToken, subscribeToPlan)
router.get('/subscription/current', verifyToken, getUserSubscription)

export default router 