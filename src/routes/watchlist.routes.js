import { Router } from 'express'
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../controllers/watchlist.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'
import { verifyProfile } from '../middlewares/profile.middleware.js'

const router = Router()

router.get('/watchlist', verifyToken, verifyProfile, getWatchlist)
router.post('/watchlist', verifyToken, verifyProfile, addToWatchlist)
router.delete('/watchlist/:movie_id', verifyToken, verifyProfile, removeFromWatchlist)

export default router