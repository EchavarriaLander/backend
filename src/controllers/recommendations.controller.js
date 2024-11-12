import { pool } from '../db.js'

export const getRecommendations = async (req, res) => {
    try {
        // Obtener películas basadas en géneros más vistos
        const [recommendations] = await pool.query(`
            SELECT DISTINCT m.* FROM movies m
            JOIN movie_genres mg ON m.id = mg.movie_id
            WHERE mg.genre_id IN (
                SELECT g.id FROM genres g
                JOIN movie_genres mg ON g.id = mg.genre_id
                JOIN viewing_progress vp ON mg.movie_id = vp.movie_id
                WHERE vp.profile_id = ?
                GROUP BY g.id
                ORDER BY COUNT(*) DESC
                LIMIT 3
            )
            AND m.id NOT IN (
                SELECT movie_id FROM viewing_progress 
                WHERE profile_id = ?
            )
            LIMIT 10
        `, [req.profile.id, req.profile.id])
        
        res.json(recommendations)
    } catch (error) {
        res.status(500).json({ message: 'Error getting recommendations' })
    }
} 