const express = require('express')
const router = express.Router()

const auth = require('../Middleware/auth')
const roleMiddleware = require('../Middleware/roleMiddleware')

const engineerDashboardController =require('../Controllers/engineerDashboardController')


// ================= ENGINEER DASHBOARD =================
router.get(
  '/',
  auth,
  roleMiddleware(['engineer']),
  engineerDashboardController.getEngineerDashboard
)

module.exports = router