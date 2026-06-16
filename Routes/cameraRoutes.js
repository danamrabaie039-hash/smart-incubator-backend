const express = require('express')
const router = express.Router()

const cameraController = require('../Controllers/cameraController')

// ESP32 registers camera
router.post('/register', cameraController.registerCamera)

module.exports = router