import { Router } from 'express'
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../controllers/watchlist.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/watchlist', verifyToken, getWatchlist)
router.post('/watchlist', verifyToken, addToWatchlist)
router.delete('/watchlist/:movie_id', verifyToken, removeFromWatchlist)

export default router