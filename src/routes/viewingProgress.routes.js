import { Router } from 'express'
import { updateViewingProgress } from '../controllers/viewingProgress.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'
import { verifyProfile } from '../middlewares/profile.middleware.js'

const router = Router()

router.post('/viewing-progress', verifyToken, verifyProfile, updateViewingProgress)

export default router 