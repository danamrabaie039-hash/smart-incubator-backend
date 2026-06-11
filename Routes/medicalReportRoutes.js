const express = require('express')
const router = express.Router()

const medicalReportController = require('../Controllers/medicalReportController')

const auth = require('../Middleware/auth')

const roleMiddleware = require('../Middleware/roleMiddleware')

// CREATE
router.post(
  '/',
  auth,
  roleMiddleware(['doctor']),
  medicalReportController.createMedicalReport
)

// GET ALL
router.get(
  '/',
  auth,
  roleMiddleware(['doctor']),
  medicalReportController.getMedicalReports
)

// GET BY ID
router.get(
  '/:id',
  auth,
  roleMiddleware(['doctor']),
  medicalReportController.getMedicalReportById
)

// UPDATE
router.put(
  '/:id',
  auth,roleMiddleware(['doctor']),
  medicalReportController.updateMedicalReport
)

// ARCHIVE
router.patch(
  '/:id/archive',
  auth,
  roleMiddleware(['doctor']),
  medicalReportController.archiveMedicalReport
)

module.exports = router