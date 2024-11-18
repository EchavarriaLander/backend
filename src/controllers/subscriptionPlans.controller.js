import { pool } from '../db.js'

export const getSubscriptionPlans = async (req, res) => {
    try {
        const [plans] = await pool.query('SELECT * FROM subscription_plans')
        res.json(plans)
    } catch (error) {
        console.error('Error getting plans:', error);
        res.status(500).json({ message: 'Error getting subscription plans' })
    }
}

export const subscribeToPlan = async (req, res) => {
    const { 
        plan_id, 
        payment_method,
        card_number,
        card_holder,
        expiration_date,
        cvv 
    } = req.body;
    const user_id = req.userId;

    try {
        await pool.query('START TRANSACTION');

        // Verificar que el plan existe
        const [plan] = await pool.query(
            'SELECT * FROM subscription_plans WHERE id = ?', 
            [plan_id]
        );    
        
        if (plan.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ message: 'Plan not found' });
        }

        // Guardar método de pago
        const [paymentMethod] = await pool.query(
            `INSERT INTO payment_methods 
             (user_id, card_number, card_holder, expiration_date, cvv) 
             VALUES (?, ?, ?, ?, ?)`,
            [user_id, card_number, card_holder, expiration_date, cvv]
        );

        // Registrar el pago
        await pool.query(
            `INSERT INTO payments 
             (user_id, subscription_plan_id, amount, payment_method, status) 
             VALUES (?, ?, ?, ?, 'completed')`,
            [user_id, plan_id, plan[0].price, payment_method]
        );

        // Crear la suscripción
        await pool.query(
            `INSERT INTO user_subscriptions 
             (user_id, subscription_id, start_date, end_date, status) 
             VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), 'active')`,
            [user_id, plan_id]
        );

        await pool.query('COMMIT');
        
        res.status(201).json({ 
            message: 'Subscription successful'
        });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Subscription error:', error);
        res.status(500).json({ 
            message: 'Error processing subscription',
            error: error.message 
        });
    }
};


export const getUserSubscription = async (req, res) => {
    try {
        const [subscription] = await pool.query(`
            SELECT s.*, us.start_date, us.end_date, us.status
            FROM user_subscriptions us
            JOIN subscription_plans s ON us.subscription_id = s.id
            WHERE us.user_id = ? 
            AND us.status = 'active'
            AND us.end_date > NOW()
        `, [req.userId])
        
        if (subscription.length === 0) {
            return res.json(null)
        }
        
        res.json(subscription[0])
    } catch (error) {
        console.error('Error getting subscription:', error);
        res.status(500).json({ 
            message: 'Error getting subscription',
            error: error.message 
        })
    }
} 