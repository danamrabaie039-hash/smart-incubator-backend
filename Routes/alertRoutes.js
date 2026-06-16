const express = require('express')
const router = express.Router()

const alertController = require('../Controllers/alertController')
const auth = require('../Middleware/auth')
const roleMiddleware = require('../Middleware/roleMiddleware')


// ================= NURSE ALERTS =================
router.get(
  '/nurse',
  auth,
  roleMiddleware(['nurse']),
  alertController.getAllAlerts
)

router.get(
  '/nurse/active',
  auth,
  roleMiddleware(['nurse']),
  alertController.getActiveAlerts
)

router.put(
  '/:id/resolve',
  auth,
  roleMiddleware(['nurse']),
  alertController.resolveAlert
)

router.put(
  '/:id/ignore',
  auth,
  roleMiddleware(['nurse']),
  alertController.ignoreAlert
)


// ================= ENGINEER ALERTS =================
router.get(
  '/engineer',
  auth,
  roleMiddleware(['engineer']),
  alertController.getAllAlerts
)

router.get(
  '/engineer/active',
  auth,
  roleMiddleware(['engineer']),
  alertController.getActiveAlerts
)
router.patch(
  '/:id/acknowledge',
  auth,
  roleMiddleware(['nurse']),
  alertController.acknowledgeAlert
)
router.patch(
  '/:id/acknowledge',
  auth,
  roleMiddleware(['engineer']),
  alertController.acknowledgeAlert
)

module.exports = router