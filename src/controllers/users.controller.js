import { pool } from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body

    try {
        // Check if user exists
        const [existingUser] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already registered' })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create user
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        )

        // Create default profile
        await pool.query(
            'INSERT INTO profiles (user_id, name) VALUES (?, ?)',
            [result.insertId, 'Default Profile']
        )

        // Generate token
        const token = jwt.sign({ id: result.insertId }, JWT_SECRET, { expiresIn: '1d' })

        res.json({ token })
    } catch (error) {
        return res.status(500).json({
            message: 'Error registering user'
        })
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const validPassword = await bcrypt.compare(password, users[0].password)
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign({ id: users[0].id }, JWT_SECRET, { expiresIn: '1d' })
        res.json({ token })
    } catch (error) {
        return res.status(500).json({
            message: 'Error during login'
        })
    }
} 