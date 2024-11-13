import { pool } from '../db.js'

export const rateMovie = async (req, res) => {
    const { movie_id, rating } = req.body
    
    try {
        await pool.query(`
            INSERT INTO ratings (profile_id, movie_id, rating)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE rating = ?
        `, [req.profile.id, movie_id, rating, rating])
        
        res.json({ message: 'Rating updated' })
    } catch (error) {
        res.status(500).json({ message: 'Error rating movie' })
    }
}
