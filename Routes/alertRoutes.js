const express = require('express')

const router = express.Router()

const alertController = require('../Controllers/alertController')

const auth = require('../Middleware/auth')

const roleMiddleware = require('../Middleware/roleMiddleware')


// ================= GET ALL ALERTS =================
router.get(
  '/',
  auth,
  roleMiddleware(['admin', 'nurse']),
  alertController.getAllAlerts
)



// ================= GET ACTIVE ALERTS =================
router.get(
  '/active',
  auth,
  roleMiddleware(['admin', 'nurse']),
  alertController.getActiveAlerts
)


// ================= RESOLVE ALERT =================
router.put(
  '/:id/resolve',
  auth,
  roleMiddleware(['admin',  'nurse']),
  alertController.resolveAlert
)


// ================= IGNORE ALERT =================
router.put(
  '/:id/ignore',
  auth,
  roleMiddleware(['admin',  'nurse']),
  alertController.ignoreAlert
)

module.exports = router