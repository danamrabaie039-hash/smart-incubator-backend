const express = require('express')
const router = express.Router()

const controller = require('../Controllers/incubatorController')

const auth = require('../Middleware/auth')
const roleMiddleware = require('../Middleware/roleMiddleware')


// ================= CREATE =================
router.post(
  '/',
  auth,
  roleMiddleware(['admin', 'engineer']),
  controller.createIncubator
)


// ================= GET ALL =================
router.get(
  '/',
  auth,
  roleMiddleware(['admin', 'doctor', 'engineer']),
  controller.getAllIncubators
)


// ================= GET BY ID =================
router.get(
  '/:id',
  auth,
  roleMiddleware(['admin', 'doctor', 'engineer']),
  controller.getIncubatorById
)


// ================= UPDATE =================
router.put(
  '/:id',
  auth,
  roleMiddleware(['admin', 'engineer']),
  controller.updateIncubator
)


// ================= MAINTENANCE MODE (IMPORTANT) =================
router.patch(
  '/:id/maintenance',
  auth,
  roleMiddleware(['admin', 'engineer']),
  controller.setMaintenanceMode
)

module.exports = router