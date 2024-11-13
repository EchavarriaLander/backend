import { Router } from 'express'
import { updateViewingHistory, getViewingHistory } from '../controllers/viewingHistory.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'
import { verifyProfile } from '../middlewares/profile.middleware.js'

const router = Router()

router.post('/viewing-history', verifyToken, verifyProfile, updateViewingHistory)
router.get('/viewing-history', verifyToken, verifyProfile, getViewingHistory)

export default router 