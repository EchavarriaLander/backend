import { Router } from 'express'
import { getProfiles, createProfile } from '../controllers/profiles.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/profiles', verifyToken, getProfiles)
router.post('/profiles', verifyToken, createProfile)

export default router 