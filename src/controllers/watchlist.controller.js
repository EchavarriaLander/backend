import { pool } from '../db.js'

export const getWatchlist = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT m.* FROM movies m 
            INNER JOIN watchlist w ON m.id = w.movie_id 
            WHERE w.profile_id = ?
        `, [req.profile.id])
        
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: 'Error getting watchlist'
        })
    }
}

export const addToWatchlist = async (req, res) => {
    const { movie_id } = req.body
    const profile_id = req.profile.id

    try {
        // Check if already in watchlist
        const [existing] = await pool.query(
            'SELECT id FROM watchlist WHERE profile_id = ? AND movie_id = ?',
            [profile_id, movie_id]
        )

        if (existing.length > 0) {
            return res.status(400).json({
                message: 'Movie already in watchlist'
            })
        }

        await pool.query(
            'INSERT INTO watchlist (profile_id, movie_id) VALUES (?, ?)',
            [profile_id, movie_id]
        )

        res.status(201).json({
            message: 'Added to watchlist'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error adding to watchlist'
        })
    }
}

export const removeFromWatchlist = async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM watchlist WHERE profile_id = ? AND movie_id = ?',
            [req.profile.id, req.params.movie_id]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Movie not found in watchlist'
            })
        }

        res.status(204).send()
    } catch (error) {
        return res.status(500).json({
            message: 'Error removing from watchlist'
        })
    }
} 