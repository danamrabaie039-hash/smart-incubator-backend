const express = require('express')
const router = express.Router()

const controller = require('../Controllers/incubatorController')

const auth = require('../Middleware/auth')
const roleMiddleware = require('../Middleware/roleMiddleware')
const sensorDeviceAuth = require('../Middleware/sensorDeviceAuth')
router.post(
  '/',
  auth,
  roleMiddleware(['engineer']),
  controller.createIncubator
)
router.get(
  '/age',
  sensorDeviceAuth,
  controller.getIncubatorAge
)
router.get(
  '/',
  auth,
  roleMiddleware(['engineer']),
  controller.getAllIncubators
)

router.get(
  '/:id',
  auth,
  roleMiddleware(['engineer']),
  controller.getIncubatorById
)

router.put(
  '/:id',
  auth,
  roleMiddleware(['engineer']),
  controller.updateIncubator
)

router.patch(
  '/:id/maintenance',
  auth,
  roleMiddleware(['engineer']),
  controller.setMaintenanceMode
)
router.get(
  '/',
  auth,
  roleMiddleware(['engineer']),
  controller.getAllIncubators
)

router.get(
  '/:id',
  auth,
  roleMiddleware(['engineer']),
  controller.getIncubatorById
)

module.exports = router