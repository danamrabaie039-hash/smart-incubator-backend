const express = require('express')
const router = express.Router()

const hourlyReportController =
  require('../Controllers/hourlyReportController')

const auth = require('../Middleware/auth')
const roleMiddleware = require('../Middleware/roleMiddleware')


// ================= CREATE REPORT =================
router.post(
  '/',
  auth,
  roleMiddleware(['nurse']),
  hourlyReportController.createHourlyReport
)


// ================= GET ALL REPORTS =================
router.get(
  '/',
  auth,
  roleMiddleware(['doctor','nurse']),
  hourlyReportController.getHourlyReports
)


// ================= GET SINGLE REPORT =================
router.get(
  '/:id',
  auth,
  roleMiddleware(['doctor','nurse']),
  hourlyReportController.getHourlyReportById
)
router.put(
  '/:id',
  auth,
  roleMiddleware(['nurse']),
  hourlyReportController.updateHourlyReport
)

router.patch(
  '/:id/archive',
  auth,
  roleMiddleware(['nurse']),
  hourlyReportController.archiveHourlyReport
)
module.exports = router