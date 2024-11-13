import { pool } from '../db.js'

export const getSubscriptionPlans = async (req, res) => {
    try {
        const [plans] = await pool.query('SELECT * FROM subscription_plans')
        res.json(plans)
    } catch (error) {
        res.status(500).json({ message: 'Error getting subscription plans' })
    }
}

export const subscribeToPlan = async (req, res) => {
    const { plan_id, payment_method } = req.body
    const user_id = req.userId

    try {
        await pool.query('START TRANSACTION')

        const [plan] = await pool.query('SELECT * FROM subscription_plans WHERE id = ?', [plan_id])
        if (plan.length === 0) {
            await pool.query('ROLLBACK')
            return res.status(404).json({ message: 'Plan not found' })
        }

        const [payment] = await pool.query(
            'INSERT INTO payments (user_id, subscription_plan_id, amount, payment_method) VALUES (?, ?, ?, ?)',
            [user_id, plan_id, plan[0].price, payment_method]
        )

        const end_date = new Date()
        end_date.setMonth(end_date.getMonth() + 1)

        await pool.query(
            'INSERT INTO user_subscriptions (user_id, subscription_id, end_date) VALUES (?, ?, ?)',
            [user_id, plan_id, end_date]
        )

        await pool.query('COMMIT')

        res.status(201).json({ 
            message: 'Subscription successful',
            payment_id: payment.insertId
        })
    } catch (error) {
        await pool.query('ROLLBACK')
        res.status(500).json({ message: 'Error processing subscription' })
    }
} 