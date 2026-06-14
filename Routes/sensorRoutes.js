const express = require('express')
const router = express.Router()

const auth = require('../Middleware/auth')
const roleMiddleware = require('../Middleware/roleMiddleware')
const { checkChildAccess } = require('../Middleware/accessMiddleware')
const sensorDeviceAuth = require('../Middleware/sensorDeviceAuth')
const sensorController = require('../Controllers/sensorController')


// ================= SENSOR DEVICE (ESP32) =================
router.post(
  '/',
  sensorDeviceAuth,
  sensorController.createSensorData
)


// ================= NURSE =================
router.get(
  '/nurse/:id',
  auth,
  checkChildAccess(),
  sensorController.getNurseSensorView
)


// ================= ENGINEER =================
router.get(
  '/engineer/:id',
  auth,
  roleMiddleware(['engineer']),
  sensorController.getEngineerSensorView
)


// ================= LATEST SENSOR =================
router.get(
  '/latest/:incubatorId',
  auth,
  roleMiddleware(['admin', 'doctor', 'nurse', 'engineer']),
  sensorController.getLatestSensorByIncubator
)

module.exports = router