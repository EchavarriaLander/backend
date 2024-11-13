import { pool } from '../db.js'

export const verifyProfile = async (req, res, next) => {
    try {
        // Verificar si hay un profile_id en los headers
        const profileId = req.headers['x-profile-id']
        if (!profileId) {
            return res.status(400).json({ message: 'Profile ID is required' })
        }

        // Verificar que el perfil existe y pertenece al usuario
        const [profiles] = await pool.query(
            'SELECT * FROM profiles WHERE id = ? AND user_id = ?',
            [profileId, req.userId]
        )

        if (profiles.length === 0) {
            return res.status(404).json({ message: 'Profile not found' })
        }

        req.profile = profiles[0]
        next()
    } catch (error) {
        res.status(500).json({ message: 'Error verifying profile' })
    }
} 