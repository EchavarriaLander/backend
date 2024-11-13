import { Router } from 'express'
import { 
    getMovies, 
    getMovieById, 
    createMovie, 
    updateMovie, 
    deleteMovie,
    getMoviesByGenre 
} from '../controllers/movies.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'
import { checkAgeRestriction } from '../middlewares/ageRestriction.middleware.js'

const router = Router()

router.get('/movies', verifyToken, getMovies)
router.get('/movies/genre/:genreId', verifyToken, getMoviesByGenre)
router.get('/movies/:id', verifyToken, checkAgeRestriction, getMovieById)
router.post('/movies', verifyToken, createMovie)
router.patch('/movies/:id', verifyToken, updateMovie)
router.delete('/movies/:id', verifyToken, deleteMovie)

export default router 