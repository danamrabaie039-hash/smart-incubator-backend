const express = require('express')
const router = express.Router()

const auth = require('../Middleware/auth')
const roleMiddleware = require('../Middleware/roleMiddleware')

const nurseDashboardController =  require('../Controllers/nurseDashboardController')


// ================= NURSE DASHBOARD =================
router.get(
  '/',
  auth,
  roleMiddleware(['nurse']),
  nurseDashboardController.getNurseDashboard
)

module.exports = router