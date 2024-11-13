import { Router } from 'express'
import { searchMovies } from '../controllers/search.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/search', verifyToken, searchMovies)

export default router 