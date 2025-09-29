import express from 'express'
import { PORT } from './config/env.js'
import authRouter from './routes/auth.routes.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/auth', authRouter)

app.get('/', (req, res) => {
  res.send('hello')
})


app.listen(PORT, () => {
  console.log(`Subscription Tracker API is running on http://localhost:${PORT}`)
})