import { Router } from 'express'
import { subscribeToPlan, getSubscriptionPlans } from '../controllers/subscriptionPlans.controller.js'
import { authRequired } from '../middlewares/validateToken.js'

const router = Router()

router.get('/subscriptions/plans', authRequired, getSubscriptionPlans)
router.post('/subscriptions/subscribe', authRequired, subscribeToPlan)

export default router