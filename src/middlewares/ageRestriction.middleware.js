import { pool } from '../db.js'

export const checkAgeRestriction = async (req, res, next) => {
    try {
        // Obtener película y perfil
        const [movie] = await pool.query('SELECT age_rating FROM movies WHERE id = ?', [req.params.id])
        const [profile] = await pool.query('SELECT date_of_birth FROM profiles WHERE id = ?', [req.profile.id])

        if (!movie[0] || !profile[0]) {
            return res.status(404).json({ message: 'Movie or profile not found' })
        }

        // Calcular edad
        const age = calculateAge(new Date(profile[0].date_of_birth))

        // Verificar restricciones
        if (!isAgeAppropriate(age, movie[0].age_rating)) {
            return res.status(403).json({ 
                message: 'Content not appropriate for profile age' 
            })
        }

        next()
    } catch (error) {
        res.status(500).json({ message: 'Error checking age restriction' })
    }
}

function calculateAge(birthDate) {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    
    return age
}

function isAgeAppropriate(age, rating) {
    const restrictions = {
        'G': 0,
        'PG': 7,
        'PG-13': 13,
        'R': 17,
        'NC-17': 18
    }
    
    return age >= (restrictions[rating] || 0)
} 