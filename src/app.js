import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import indexRoutes from './routes/index.routes.js'
import moviesRoutes from './routes/movies.routes.js'
import usersRoutes from './routes/users.routes.js'
import watchlistRoutes from './routes/watchlist.routes.js'
import subscriptionsRoutes from './routes/subscriptions.routes.js'
import searchRoutes from './routes/search.routes.js'
import profilesRoutes from './routes/profiles.routes.js'
import paymentsRoutes from './routes/payments.routes.js'
import { errorHandler } from './middlewares/error.middleware.js'

const app = express()

// Configuración de CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use(indexRoutes)
app.use('/api', moviesRoutes)
app.use('/api', usersRoutes)
app.use('/api', watchlistRoutes)
app.use('/api', subscriptionsRoutes)
app.use('/api', searchRoutes)
app.use('/api', profilesRoutes)
app.use('/api', paymentsRoutes)

app.use(errorHandler)

app.use((req, res) => {
    res.status(404).json({
        message: 'La ruta solicitada no existe'
    })
})

export default app;