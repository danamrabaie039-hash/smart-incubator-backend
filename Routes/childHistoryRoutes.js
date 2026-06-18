const express = require('express')
const router = express.Router()

const auth = require('../Middleware/auth')
const roleMiddleware = require('../Middleware/roleMiddleware')

const childHistoryController =
require('../Controllers/childHistoryController')

router.get(
  '/:id',
  auth,
  roleMiddleware(['nurse']),
  childHistoryController.getChildHistory
)

module.exports = router