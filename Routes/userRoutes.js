const express = require('express')
const router = express.Router()

const userController = require('../Controllers/userController')
const auth = require('../Middleware/auth')
const roleMiddleware = require('../Middleware/roleMiddleware')
router.post('/create-engineer', userController.createEngineer)
// ================= LOGIN =================
router.post(
  '/login',
  userController.login
)

// ================= CREATE ENGINEER =================
router.post(
  '/create-engineer',
  auth,
  roleMiddleware(['engineer']),
  userController.createEngineer
)




// ================= CREATE DOCTOR =================
router.post(
  '/create-doctor',
  auth,
  roleMiddleware(['engineer']),
  userController.createDoctor
)

// ================= CREATE NURSE =================
router.post(
  '/create-nurse',
  auth,
  roleMiddleware(['engineer']),
  userController.createNurse
)

// ================= CREATE PARENT =================
router.post(
  '/create-parent',
  auth,
  roleMiddleware(['engineer']),
  userController.createParent
)

module.exports = router