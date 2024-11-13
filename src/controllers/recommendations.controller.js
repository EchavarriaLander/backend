import { pool } from '../db.js'

export const getRecommendations = async (req, res) => {
    try {
        // Primero verificar si el perfil tiene historial
        const [hasHistory] = await pool.query(
            'SELECT COUNT(*) as count FROM viewing_history WHERE profile_id = ?',
            [req.profile.id]
        )

        let recommendations;
        
        if (hasHistory[0].count === 0) {
            // Si no hay historial, devolver películas aleatorias
            [recommendations] = await pool.query(`
                SELECT DISTINCT m.* 
                FROM movies m 
                ORDER BY RAND() 
                LIMIT 10
            `)
        } else {
            // Si hay historial, usar géneros más vistos
            [recommendations] = await pool.query(`
                SELECT DISTINCT m.* 
                FROM movies m
                JOIN movie_genres mg ON m.id = mg.movie_id
                WHERE mg.genre_id IN (
                    SELECT DISTINCT mg2.genre_id
                    FROM viewing_history vh
                    JOIN movies m2 ON vh.movie_id = m2.id
                    JOIN movie_genres mg2 ON m2.id = mg2.movie_id
                    WHERE vh.profile_id = ?
                )
                AND m.id NOT IN (
                    SELECT movie_id 
                    FROM viewing_history 
                    WHERE profile_id = ?
                )
                ORDER BY RAND()
                LIMIT 10
            `, [req.profile.id, req.profile.id])
        }
        
        res.json(recommendations)
    } catch (error) {
        console.error('Recommendations error:', error);
        res.status(500).json({ 
            message: 'Error getting recommendations',
            error: error.message 
        })
    }
} 