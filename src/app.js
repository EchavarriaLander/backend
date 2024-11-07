import express from 'express'
import employeesRoutes from './routes/employees.routes.js'
import indexRoutes from './routes/index.routes.js'


const app = express()

app.use(express.json())

app.use(indexRoutes)
app.use('/api',employeesRoutes)

app.use((req, res) => {
  res.status(404).json({
    message: 'La ruta solicitada no existe'
  })
})

export default app;