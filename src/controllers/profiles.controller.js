import { pool } from '../db.js'

export const getProfiles = async (req, res) => {
    try {
        const [profiles] = await pool.query(`
            SELECT p.*
            FROM profiles p
            WHERE p.user_id = ?
        `, [req.userId])
        
        res.json(profiles)
    } catch (error) {
        res.status(500).json({ message: 'Error getting profiles' })
    }
}

export const createProfile = async (req, res) => {
    const { name, avatar_url, date_of_birth } = req.body
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
            'INSERT INTO profiles (user_id, name, avatar_url, date_of_birth) VALUES (?, ?, ?, ?)',
            [req.userId, name, avatar_url, date_of_birth]
        )
        
        res.status(201).json({
            id: result.insertId,
            name,
            avatar_url,
            date_of_birth
        })
    } catch (error) {
        res.status(500).json({ message: 'Error creating profile' })
    }
} 