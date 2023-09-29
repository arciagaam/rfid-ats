import express from 'express'
import connectDB from './db/connect.js'

import userRoutes from './routes/userRoutes.js'

import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT || 5000
connectDB()

const app = express()

app.get('/', (req, res) => {
    res.send('Api is running...')
})

app.get('/api/users', (userRoutes) => {})
