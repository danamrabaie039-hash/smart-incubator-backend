const express = require('express')
const router = express.Router()

const userController = require('../Controllers/userController')
const auth = require('../Middleware/auth')
const roleMiddleware = require('../Middleware/roleMiddleware')
router.post('/bootstrap-admin', userController.bootstrapAdmin)

// ================= LOGIN =================
router.post(
  '/login',
  userController.login
)

// ================= CREATE USER (ADMIN ONLY) =================
router.post(
  '/create-user',
  auth,
  roleMiddleware(['admin']),
  userController.createUser
)

module.exports = router