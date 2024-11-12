import { pool } from '../db.js'

export const getProfiles = async (req, res) => {
    try {
        const [profiles] = await pool.query(`
            SELECT p.*, 
                   COUNT(DISTINCT vp.movie_id) as movies_watched,
                   GROUP_CONCAT(DISTINCT g.name) as favorite_genres
            FROM profiles p
            LEFT JOIN viewing_progress vp ON p.id = vp.profile_id
            LEFT JOIN movie_genres mg ON vp.movie_id = mg.movie_id
            LEFT JOIN genres g ON mg.genre_id = g.id
            WHERE p.user_id = ?
            GROUP BY p.id
        `, [req.userId])
        
        res.json(profiles)
    } catch (error) {
        res.status(500).json({ message: 'Error getting profiles' })
    }
}

export const createProfile = async (req, res) => {
    const { name, avatar_url } = req.body
    try {
        // Verificar límite de perfiles (ejemplo: máximo 5)
        const [existingProfiles] = await pool.query(
            'SELECT COUNT(*) as count FROM profiles WHERE user_id = ?',
            [req.userId]
        )
        
        if (existingProfiles[0].count >= 5) {
            return res.status(400).json({ message: 'Profile limit reached' })
        }

        const [result] = await pool.query(
            'INSERT INTO profiles (user_id, name, avatar_url) VALUES (?, ?, ?)',
            [req.userId, name, avatar_url]
        )
        
        res.status(201).json({
            id: result.insertId,
            name,
            avatar_url
        })
    } catch (error) {
        res.status(500).json({ message: 'Error creating profile' })
    }
} 