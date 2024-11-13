import { pool } from '../db.js'

export const getUserSubscription = async (req, res) => {
    try {
        const [subscription] = await pool.query(`
            SELECT s.*, us.start_date, us.end_date, us.status
            FROM user_subscriptions us
            JOIN subscriptions s ON us.subscription_id = s.id
            WHERE us.user_id = ? AND us.status = 'active'
            AND us.end_date > NOW()
        `, [req.userId])
        
        res.json(subscription[0] || null)
    } catch (error) {
        res.status(500).json({ message: 'Error getting subscription' })
    }
}

export const getSubscriptionPlans = async (req, res) => {
    try {
        const [plans] = await pool.query('SELECT * FROM subscription_plans')
        res.json(plans)
    } catch (error) {
        res.status(500).json({ message: 'Error getting subscription plans' })
    }
}

export const subscribe = async (req, res) => {
    const { plan_id, payment_method } = req.body
    
    try {
        const [plan] = await pool.query('SELECT * FROM subscription_plans WHERE id = ?', [plan_id])
        
        if (!plan[0]) {
            return res.status(404).json({ message: 'Subscription plan not found' })
        }

        await pool.query(`
            INSERT INTO payments (user_id, subscription_plan_id, amount, payment_method)
            VALUES (?, ?, ?, ?)
        `, [req.userId, plan_id, plan[0].price, payment_method])
        
        res.json({ message: 'Subscription successful' })
    } catch (error) {
        res.status(500).json({ message: 'Error processing subscription' })
    }
}
