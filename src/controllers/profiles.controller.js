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
    try {
        const { name, is_kids, avatar_url } = req.body;
        const user_id = req.userId; // Esto viene del middleware authRequired

        const [result] = await pool.query(
            'INSERT INTO profiles (user_id, name, is_kids, avatar_url) VALUES (?, ?, ?, ?)',
            [user_id, name, is_kids, avatar_url]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            is_kids,
            avatar_url
        });
    } catch (error) {
        console.error('Error in createProfile:', error);
        res.status(500).json({ message: 'Error creating profile' });
    }
};

export const updateProfile = async (req, res) => {
    const { id } = req.params;
    const { name, avatar_url, is_kids } = req.body;
    
    try {
        // Validar datos
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ 
                message: 'Profile name is required' 
            });
        }

        const [result] = await pool.query(
            `UPDATE profiles 
             SET name = ?,
                 avatar_url = ?,
                 is_kids = ?
             WHERE id = ? AND user_id = ?`,
            [name, avatar_url, is_kids, id, req.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        const [updatedProfile] = await pool.query(
            'SELECT * FROM profiles WHERE id = ?',
            [id]
        );

        res.json(updatedProfile[0]);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

export const deleteProfile = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Eliminar registros relacionados
        await pool.query('DELETE FROM watchlist WHERE profile_id = ?', [id]);
        
        const [result] = await pool.query(
            'DELETE FROM profiles WHERE id = ? AND user_id = ?',
            [id, req.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting profile' });
    }
}; 