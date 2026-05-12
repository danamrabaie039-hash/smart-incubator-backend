const express = require('express')
const router = express.Router()

const userController = require('../Controllers/userController')
const auth = require('../Middleware/auth')
const roleMiddleware = require('../Middleware/roleMiddleware')


// ================= LOGIN =================
router.post('/login', userController.login)


// ================= ENGINEER (ONLY ADMIN) =================
// لازم يكون محمي
router.post(
  '/create-engineer',
  auth,
  roleMiddleware(['engineer']),
  userController.createEngineer
)


// ================= DOCTOR =================
router.post(
  '/create-doctor',
  auth,
  roleMiddleware(['engineer']),
  userController.createDoctor
)


// ================= NURSE =================
router.post(
  '/create-nurse',
  auth,
  roleMiddleware(['engineer']),
  userController.createNurse
)


// ================= PARENT =================
router.post(
  '/create-parent',
  auth,
  roleMiddleware(['engineer']),
  userController.createParent
)

module.exports = router
