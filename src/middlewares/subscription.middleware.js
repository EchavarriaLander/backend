import { pool } from '../db.js'

export const checkActiveSubscription = async (req, res, next) => {
    try {
        const [subscription] = await pool.query(`
            SELECT * FROM user_subscriptions 
            WHERE user_id = ? 
            AND status = 'active' 
            AND end_date > NOW()
            ORDER BY end_date DESC 
            LIMIT 1
        `, [req.userId])

        if (subscription.length === 0) {
            return res.status(403).json({ 
                message: 'Active subscription required' 
            })
        }

        req.subscription = subscription[0]
        next()
    } catch (error) {
        res.status(500).json({ 
            message: 'Error checking subscription status' 
        })
    }
}
