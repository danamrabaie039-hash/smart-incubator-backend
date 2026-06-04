const express = require('express')
const router = express.Router()

const dashboardController = require('../Controllers/dashboardController')
const auth = require('../Middleware/auth')
const roleMiddleware = require('../Middleware/roleMiddleware')


// ================= LATEST SENSOR =================
router.get(
  '/latest/:incubatorId',
  auth,
  roleMiddleware(['admin', 'doctor', 'nurse']),
  dashboardController.getLatestSensorByIncubator
)


// ================= SUMMARY DASHBOARD =================
router.get(
  '/summary',
  auth,
  roleMiddleware(['admin']),
  dashboardController.getDashboardSummary
)


// ================= ROLE DASHBOARD =================
router.get(
  '/role',
  auth,
  roleMiddleware(['admin', 'doctor', 'nurse']),
  dashboardController.getRoleDashboard
)

module.exports = router