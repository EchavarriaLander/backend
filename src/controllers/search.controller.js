import { pool } from '../db.js'

export const searchMovies = async (req, res) => {
    const { query } = req.query
    
    try {
        const [results] = await pool.query(`
            SELECT DISTINCT m.* 
            FROM movies m
            LEFT JOIN movie_genres mg ON m.id = mg.movie_id
            LEFT JOIN genres g ON mg.genre_id = g.id
            WHERE m.title LIKE ? 
            OR m.description LIKE ?
            OR g.name LIKE ?
        `, [`%${query}%`, `%${query}%`, `%${query}%`])
        
        res.json(results)
    } catch (error) {
        res.status(500).json({ message: 'Error searching movies' })
    }
}
