const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')

const userRoutes = require('./Routes/userRoutes')
const childRoutes = require('./Routes/childRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: "Smart Incubator API is running 🚀" })
})

app.use('/api/users', userRoutes)
app.use('/api/children', childRoutes) 

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
  app.listen(PORT, () => {
    console.log("Server running on port", PORT)
  })
})

