import { pool } from '../db.js'

export const createPayment = async (req, res) => {
    const { subscription_plan_id, amount, payment_method } = req.body
    
    try {
        // Verificar que el plan existe
        const [plan] = await pool.query(
            'SELECT * FROM subscription_plans WHERE id = ?',
            [subscription_plan_id]
        )
        
        if (plan.length === 0) {
            return res.status(404).json({ message: 'Subscription plan not found' })
        }

        // Crear el pago
        const [result] = await pool.query(
            `INSERT INTO payments (user_id, subscription_plan_id, amount, payment_method, status) 
             VALUES (?, ?, ?, ?, 'completed')`,
            [req.userId, subscription_plan_id, amount, payment_method]
        )
        
        res.status(201).json({
            message: 'Payment processed successfully',
            payment_id: result.insertId
        })
    } catch (error) {
        console.error('Payment error:', error)
        res.status(500).json({ 
            message: 'Error processing payment',
            error: error.message 
        })
    }
}

export const getPaymentHistory = async (req, res) => {
    try {
        const [payments] = await pool.query(
            `SELECT p.*, s.name as plan_name 
             FROM payments p
             JOIN subscription_plans s ON p.subscription_plan_id = s.id
             WHERE p.user_id = ?
             ORDER BY p.created_at DESC`,
            [req.userId]
        );
        
        res.json(payments)
    } catch (error) {
        res.status(500).json({ 
            message: 'Error getting payment history',
            error: error.message 
        })
    }
} 