const express = require('express')
const router = express.Router()

const controller = require('../Controllers/userController')
const auth = require('../Middleware/auth')
const roleMiddleware = require('../Middleware/roleMiddleware')


// ================= LOGIN =================
router.post('/login', controller.login)


// ================= CREATE USER (ADMIN ONLY) =================
router.post(
  '/',
  auth,
  roleMiddleware(['admin']),
  controller.createUser
)


// ================= GET ALL USERS =================
router.get(
  '/',
  auth,
  roleMiddleware(['admin']),
  controller.getAllUsers
)
// ================= CHANGE PASSWORD =================
router.patch(
  '/change-password',
  auth,
  controller.changePassword
)

// ================= GET USER BY ID =================
router.get(
  '/:id',
  auth,
  roleMiddleware(['admin']),
  controller.getUserById
)


// ================= UPDATE USER =================
router.patch(
  '/:id',
  auth,
  roleMiddleware(['admin']),
  controller.updateUser
)


// ================= DEACTIVATE USER =================
router.patch(
  '/:id/deactivate',
  auth,
  roleMiddleware(['admin']),
  controller.deactivateUser
)


module.exports = router