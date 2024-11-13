import { Router } from 'express'
import { getContinueWatching } from '../controllers/continue.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'
import { verifyProfile } from '../middlewares/profile.middleware.js'

const router = Router()

router.get('/continue-watching', verifyToken, verifyProfile, getContinueWatching)

export default router 