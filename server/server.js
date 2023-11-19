import express from 'express'
import connectDB from './db/connect.js'
import cookieParser from 'cookie-parser'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import rfidRoutes from './routes/rfidRoutes.js'
import accomplishmentReportRoutes from './routes/accomplishmentReportRoutes.js'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import fileUpload from 'express-fileupload'

dotenv.config()
let connectionLogged = false

const port = process.env.PORT || 5000
connectDB()

const app = express()

//socket server
const socketServer = createServer(app)
const io = new Server(socketServer, {
    cors: {
        origin: ['http://localhost:5173'],
    },
})

io.on('connection', (socket) => {
    if (!connectionLogged) {
        console.log('Socket connection initialized'.blue.bold)
        connectionLogged = true
    }

    socket.on('disconnect', () => {
        console.log('Socket connection disconnected'.red.bold)
        connectionLogged = false
    })
})

app.use((req, res, next) => {
    req.io = io
    return next()
})

app.use(express.static('public'))
app.use('/images', express.static('images'))

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use(fileUpload())

// Cookie parser middleware
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Api is running...')
})

app.use('/api/users', userRoutes)
app.use('/api/rfid', rfidRoutes)
app.use('/api/accomplishment-reports', accomplishmentReportRoutes)

app.use(notFound)
app.use(errorHandler)

socketServer.listen(port, () => {
    console.log('==========================='.yellow.bold)
    console.log(`Server running on port ${port}`.yellow.bold)
})
