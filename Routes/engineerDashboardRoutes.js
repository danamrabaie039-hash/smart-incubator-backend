const express = require('express')
const router = express.Router()

const auth = require('../Middleware/auth')
const role = require('../Middleware/roleMiddleware')

const engineerDashboardController =require('../Controllers/engineerDashboardController')


// ================= ENGINEER DASHBOARD =================
router.get(
  '/',
  auth,
  role(['engineer']),
  engineerDashboardController.getEngineerDashboard
)

module.exports = router