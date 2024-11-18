import { Router } from 'express'
import { getProfiles, createProfile, updateProfile, deleteProfile } from '../controllers/profiles.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/api/profiles', verifyToken, getProfiles)
router.post('/api/profiles', verifyToken, createProfile)
router.put('/api/profiles/:id', verifyToken, updateProfile)
router.delete('/api/profiles/:id', verifyToken, deleteProfile)

export default router 