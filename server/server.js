import express from 'express'
import connectDB from './db/connect.js'
import cookieParser from 'cookie-parser'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import cors from 'cors';
import userRoutes from './routes/userRoutes.js'
import rfidRoutes from './routes/rfidRoutes.js'
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT || 5000
connectDB()

const app = express()

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());

// Cookie parser middleware
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Api is running...')
})

app.use('/api/users', userRoutes)
app.use('/api/rfid', rfidRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
