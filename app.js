const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()

const userRoutes = require('./Routes/userRoutes')

const app = express()

const cors = require('cors')
app.use(cors())

// Middleware
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({ message: "Smart Incubator API is running 🚀" })
})


// Routes
app.use('/api/users', userRoutes)

// Database Connection
const connectToDB = async () => {
  try {
    mongoose.set('strictQuery', false)

    await mongoose.connect(process.env.MONGO_URI)

    console.log("Connected to Database")

  } catch (error) {
    console.log("Error Connecting to Database:", error)
  }
}

connectToDB()

// Server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})