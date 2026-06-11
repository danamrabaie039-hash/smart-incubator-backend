const express = require('express')
const router = express.Router()

const auth = require('../Middleware/auth')
const roleMiddleware = require('../Middleware/roleMiddleware')

const doctorDashboardController =
  require('../Controllers/doctorDashboardController')


// ================= DOCTOR DASHBOARD =================
router.get(
  '/',
  auth,
  roleMiddleware(['doctor']),
  doctorDashboardController.getDoctorDashboard
)

module.exports = router