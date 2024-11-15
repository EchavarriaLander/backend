import { pool } from '../db.js'

export const getMovies = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM movies')
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: 'Error getting movies'
        })
    }
}

export const getMovieById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM movies WHERE id = ?', [req.params.id])
    
        if (rows.length <= 0) {
            return res.status(404).json({
                message: 'Movie not found'
            })
        }

        // Get movie genres
        const [genres] = await pool.query(
            'SELECT g.* FROM genres g JOIN movie_genres mg ON g.id = mg.genre_id WHERE mg.movie_id = ?', 
            [req.params.id]
        )

        res.json({
            ...rows[0],
            genres
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error getting movie'
        })
    }
}

export const createMovie = async (req, res) => {
    const {title, description, duration, release_year, video_url, thumbnail_url, genres} = req.body

    try {
        const [result] = await pool.query(
            'INSERT INTO movies (title, description, duration, release_year, video_url, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, duration, release_year, video_url, thumbnail_url]
        )

        // Add genres
        if (genres && genres.length > 0) {
            const values = genres.map(genreId => [result.insertId, genreId])
            await pool.query('INSERT INTO movie_genres (movie_id, genre_id) VALUES ?', [values])
        }

        res.json({
            id: result.insertId,
            title,
            description,
            duration,
            release_year,
            video_url,
            thumbnail_url,
            genres
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error creating movie'
        })
    }
}

export const deleteMovie = async (req, res) => {
    try {
        await pool.query('START TRANSACTION')

        // Eliminar de watchlist
        await pool.query('DELETE FROM watchlist WHERE movie_id = ?', [req.params.id])
        
        // Eliminar géneros asociados
        await pool.query('DELETE FROM movie_genres WHERE movie_id = ?', [req.params.id])
        
        // Eliminar la película
        const [result] = await pool.query('DELETE FROM movies WHERE id = ?', [req.params.id])
    
        if (result.affectedRows <= 0) {
            await pool.query('ROLLBACK')
            return res.status(404).json({
                message: 'Movie not found'
            })
        }
    
        await pool.query('COMMIT')
        res.sendStatus(204)
    } catch (error) {
        await pool.query('ROLLBACK')
        return res.status(500).json({
            message: 'Error deleting movie'
        })
    }
}

export const updateMovie = async (req, res) => {
    const { id } = req.params
    const { title, description, duration, release_year, video_url, thumbnail_url, genres } = req.body

    try {
        const [result] = await pool.query(
            'UPDATE movies SET title = IFNULL(?, title), description = IFNULL(?, description), duration = IFNULL(?, duration), release_year = IFNULL(?, release_year), video_url = IFNULL(?, video_url), thumbnail_url = IFNULL(?, thumbnail_url) WHERE id = ?',
            [title, description, duration, release_year, video_url, thumbnail_url, id]
        )
        
        if (result.affectedRows <= 0) {
            return res.status(404).json({
                message: 'Movie not found'
            })
        }

        // Update genres if provided
        if (genres && genres.length > 0) {
            // Remove old genres
            await pool.query('DELETE FROM movie_genres WHERE movie_id = ?', [id])
            
            // Add new genres
            const values = genres.map(genreId => [id, genreId])
            await pool.query('INSERT INTO movie_genres (movie_id, genre_id) VALUES ?', [values])
        }
    
        const [rows] = await pool.query('SELECT * FROM movies WHERE id = ?', [id])
        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating movie'
        })
    }
}

export const getMoviesByGenre = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT m.* FROM movies m 
            INNER JOIN movie_genres mg ON m.id = mg.movie_id 
            WHERE mg.genre_id = ?
        `, [req.params.genreId])
        
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: 'Error getting movies by genre'
        })
    }
} 