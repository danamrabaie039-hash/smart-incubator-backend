const express = require('express')

const router = express.Router()

const controller = require('../Controllers/userChildAccessController')

const auth = require('../Middleware/auth')

const roleMiddleware = require('../Middleware/roleMiddleware')


// ================= CREATE ACCESS =================
router.post(
  '/',
  auth,
  roleMiddleware(['admin']),
  controller.createAccess
)


// ================= GET ALL ACCESS =================
router.get(
  '/',
  auth,
  roleMiddleware(['admin']),
  controller.getAllAccess
)


// ================= GET ACCESS BY USER =================
router.get(
  '/user/:userId',
  auth,
  roleMiddleware(['admin']),
  controller.getAccessByUser
)


// ================= GET ACCESS BY CHILD =================
router.get(
  '/child/:childId',
  auth,
  roleMiddleware(['admin']),
  controller.getAccessByChild
)


// ================= DEACTIVATE ACCESS =================
router.patch(
  '/:id/deactivate',
  auth,
  roleMiddleware(['admin']),
  controller.deactivateAccess
)

module.exports = router