import { pool } from '../db.js'

export const updateViewingHistory = async (req, res) => {
    const { movie_id, watched_time, completed } = req.body
    
    try {
        await pool.query(`
            INSERT INTO viewing_history (profile_id, movie_id, watched_time, completed)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                watched_time = ?,
                completed = ?,
                last_watched = CURRENT_TIMESTAMP
        `, [req.profile.id, movie_id, watched_time, completed, watched_time, completed])
        
        res.json({ message: 'History updated' })
    } catch (error) {
        res.status(500).json({ message: 'Error updating viewing history' })
    }
}

export const getViewingHistory = async (req, res) => {
    try {
        const [results] = await pool.query(`
            SELECT m.*, vh.watched_time, vh.completed, vh.last_watched
            FROM viewing_history vh
            JOIN movies m ON vh.movie_id = m.id
            WHERE vh.profile_id = ?
            ORDER BY vh.last_watched DESC
        `, [req.profile.id])
        
        res.json(results)
    } catch (error) {
        res.status(500).json({ message: 'Error getting viewing history' })
    }
} 