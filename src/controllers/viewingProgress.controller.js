import { pool } from '../db.js'

export const updateViewingProgress = async (req, res) => {
    const { movie_id, progress_seconds, completed } = req.body
    
    try {
        await pool.query(`
            INSERT INTO viewing_progress (profile_id, movie_id, progress_seconds, completed)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                progress_seconds = ?,
                completed = ?,
                last_watched = CURRENT_TIMESTAMP
        `, [req.profile.id, movie_id, progress_seconds, completed, progress_seconds, completed])
        
        res.json({ message: 'Progress updated' })
    } catch (error) {
        res.status(500).json({ message: 'Error updating viewing progress' })
    }
} 