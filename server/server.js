import express from 'express'
import connectDB from './db/connect.js'
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT || 5000
connectDB()

const app = express()

app.get('/', (req, res) => {
    res.send('RFID')
})

app.get('/api/users', (req, res) => {
    res.send('API')
})
