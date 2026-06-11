const express = require('express')
const router = express.Router()

const maintenanceController = require('../Controllers/maintenanceController')

const auth = require('../Middleware/auth')
const roleMiddleware = require('../Middleware/roleMiddleware')


// ================= CREATE MAINTENANCE =================
router.post(
  '/',
  auth,
   roleMiddleware(['engineer']),
  maintenanceController.createMaintenance
)


// ================= GET ALL MAINTENANCE =================
router.get(
  '/',
  auth,
   roleMiddleware(['engineer']),
  maintenanceController.getMaintenance
)


// ================= UPDATE MAINTENANCE =================
router.put(
  '/:id',
  auth,
   roleMiddleware(['engineer']),
  maintenanceController.updateMaintenance
)


// ================= ARCHIVE MAINTENANCE =================
router.patch(
  '/:id/archive',
  auth,
   roleMiddleware(['engineer']),
  maintenanceController.archiveMaintenance
)
module.exports = router