const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const userRoutes = require('./Routes/userRoutes')
const childRoutes = require('./Routes/childRoutes')
const incubatorRoutes = require('./Routes/incubatorRoutes')
const sensorRoutes = require('./Routes/sensorRoutes')
const alertRoutes = require('./Routes/alertRoutes')
const hourlyReportRoutes = require('./Routes/hourlyReportRoutes')
const medicalReportRoutes = require('./Routes/medicalReportRoutes')
const maintenanceRoutes = require('./Routes/maintenanceRoutes')
const engineerDashboardRoutes = require('./Routes/engineerDashboardRoutes')
const nurseDashboardRoutes = require('./Routes/nurseDashboardRoutes')
const doctorDashboardRoutes = require('./Routes/doctorDashboardRoutes')
const qrRoutes = require('./Routes/qrRoutes')
const cameraRoutes = require('./Routes/cameraRoutes')
const childHistoryRoutes = require('./Routes/childHistoryRoutes')
const app = express()


const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*"
  }
})
app.set('io', io)
app.use(cors())
app.use(express.json())

app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.json({ message: "Smart Incubator API is running 🚀" })
})
app.use(express.static('public'))
app.use('/api/users', userRoutes)
app.use('/api/children', childRoutes) 
app.use('/api/access', require('./Routes/userChildAccessRoutes'))
app.use('/api/incubators', incubatorRoutes)
app.use('/api/sensors', sensorRoutes) 
app.use('/api/alerts', alertRoutes)
app.use('/api/hourly-reports', hourlyReportRoutes)
app.use('/api/medical-reports', medicalReportRoutes)
app.use('/api/maintenance', maintenanceRoutes)
app.use('/api/engineer-dashboard', engineerDashboardRoutes)
app.use('/api/nurse-dashboard', nurseDashboardRoutes)
app.use('/api/doctor-dashboard', doctorDashboardRoutes)
app.use('/api/qr', qrRoutes)
app.use('/api/camera', cameraRoutes)
app.use('/api/child-history', childHistoryRoutes)

io.on('connection', (socket) => {
  console.log('Socket Connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('Socket Disconnected:', socket.id)
  })
})
const connectToDB = async () => {
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB Connected Successfully 🚀")
  } catch (error) {
    console.log("Error Connecting to Database:", error)
  }
}

const PORT = process.env.PORT || 5000

connectToDB().then(() => {
server.listen(PORT, () => {
  console.log("Server running on port", PORT)
})

})