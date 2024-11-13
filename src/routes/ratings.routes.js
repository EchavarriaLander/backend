import { Router } from 'express'
import { rateMovie } from '../controllers/ratings.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'
import { verifyProfile } from '../middlewares/profile.middleware.js'

const router = Router()

router.post('/ratings', verifyToken, verifyProfile, rateMovie)

export default router 