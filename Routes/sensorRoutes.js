const express = require('express')
const router = express.Router()

const auth = require('../Middleware/auth')
const roleMiddleware = require('../Middleware/roleMiddleware') 
const { checkChildAccess } = require('../Middleware/accessMiddleware')
const sensorDeviceAuth = require('../Middleware/sensorDeviceAuth')
const sensorController = require('../Controllers/sensorController')


// ================= DEVICE (HARDWARE) =================
router.post(
  '/',
  sensorDeviceAuth,
  sensorController.createSensorData
)


// ================= USER (DOCTOR / NURSE VIEW) =================
router.get(
  '/latest/:id',
  auth,
  checkChildAccess('view'),
  sensorController.getLatestSensorByIncubator
)

router.get(
  '/dashboard/:id',
  auth,
  checkChildAccess('view'),
  sensorController.getSensorDashboard
)


// ================= DEV / TEST ONLY =================
router.post(
  '/mock',
  sensorController.mockSensorData
)

module.exports = router