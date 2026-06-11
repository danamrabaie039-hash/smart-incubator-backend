const express = require('express')
const router = express.Router()

const auth = require('../Middleware/auth')
const roleMiddleware = require('../Middleware/roleMiddleware') 
const { checkChildAccess } = require('../Middleware/accessMiddleware')
const sensorDeviceAuth = require('../Middleware/sensorDeviceAuth')
const sensorController = require('../Controllers/sensorController')

// nurse
router.get('/nurse/:id', auth, checkChildAccess(), sensorController.getNurseSensorView)

// engineer
router.get('/engineer/:id', auth, roleMiddleware(['engineer']), sensorController.getEngineerSensorView)
router.get(
  '/latest/:incubatorId',
  auth,
  roleMiddleware(['admin', 'doctor', 'nurse']),
  sensorController.getLatestSensorByIncubator
)
module.exports = router