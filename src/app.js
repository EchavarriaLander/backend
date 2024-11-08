import express from 'express'
import indexRoutes from './routes/index.routes.js'
import moviesRoutes from './routes/movies.routes.js'
import usersRoutes from './routes/users.routes.js'
import watchlistRoutes from './routes/watchlist.routes.js'

const app = express()

app.use(express.json())

app.use(indexRoutes)
app.use('/api', moviesRoutes)
app.use('/api', usersRoutes)
app.use('/api', watchlistRoutes)

app.use((req, res) => {
  res.status(404).json({
    message: 'La ruta solicitada no existe'
  })
})

export default app;