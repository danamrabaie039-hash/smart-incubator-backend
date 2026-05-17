const express = require('express')

const router = express.Router()

const childController = require('../Controllers/childController')

const auth = require('../Middleware/auth')

const roleMiddleware = require('../Middleware/roleMiddleware')

// ================= CREATE CHILD =================
router.post(
  '/create-child',
  auth,
  roleMiddleware(['engineer']),
  childController.createChild
)

module.exports = router