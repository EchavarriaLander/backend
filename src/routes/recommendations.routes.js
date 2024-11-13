import { Router } from 'express'
import { getRecommendations } from '../controllers/recommendations.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'
import { verifyProfile } from '../middlewares/profile.middleware.js'

const router = Router()

router.get('/recommendations', verifyToken, verifyProfile, getRecommendations)

export default router 