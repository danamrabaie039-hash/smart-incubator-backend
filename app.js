const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const userRoutes = require('./Routes/userRoutes')

const app = express()


const cors = require('cors')
app.use(cors())
// Middleware
app.use(bodyParser.json())
// Routes
app.use('/api/users', userRoutes)
// Database Connection
const uri = "mongodb://project_user:Incubator%40%23123@ac-oe5qttj-shard-00-00.quyq5q8.mongodb.net:27017,ac-oe5qttj-shard-00-01.quyq5q8.mongodb.net:27017,ac-oe5qttj-shard-00-02.quyq5q8.mongodb.net:27017/incubator-db?ssl=true&replicaSet=atlas-k10syb-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"

const connectToDB = async () => {
  try {
    mongoose.set('strictQuery', false)

    await mongoose.connect(uri)

    console.log("Connected to Database")

  } catch (error) {

    console.log("Error Connecting to Database:", error)

  }
}

connectToDB()


// Server
app.listen(5000, () => {
  console.log("Server running on port 5000")
})