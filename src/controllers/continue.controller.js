import { pool } from '../db.js'

export const getContinueWatching = async (req, res) => {
    try {
        const [results] = await pool.query(`
            SELECT m.*, vh.watched_time, vh.last_watched
            FROM viewing_history vh
            JOIN movies m ON vh.movie_id = m.id
            WHERE vh.profile_id = ?
            AND vh.completed = FALSE
            ORDER BY vh.last_watched DESC
            LIMIT 10
        `, [req.profile.id])
        
        res.json(results)
    } catch (error) {
        res.status(500).json({ message: 'Error getting continue watching list' })
    }
} 