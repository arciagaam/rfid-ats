import express from 'express'
import connectDB from './db/connect.js'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

app.get('/', (req, res) => {
    res.send('RFID')
})

const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(process.env.PORT, () => {
            console.log(`Server is listening to port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

startServer()
