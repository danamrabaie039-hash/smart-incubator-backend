const express = require('express')
const router = express.Router()

const childController = require('../Controllers/childController')
const auth = require('../Middleware/auth')
const roleMiddleware = require('../Middleware/roleMiddleware')
const accessMiddleware = require('../Middleware/accessMiddleware')


// ================= CREATE CHILD =================
router.post(
  '/',
  auth,
  roleMiddleware(['nurse']),
  childController.createChild
)


// ================= GET ALL CHILDREN =================
router.get(
  '/',
  auth,
  roleMiddleware(['doctor','nurse']),
  childController.getAllChildren
)

// ================= GET CHILD BY ID =================
router.get(
  '/:id',
  auth,
  accessMiddleware.checkChildAccess(),
  childController.getChildById
)

// ================= UPDATE CHILD =================
router.put(
  '/:id',
  auth,
  roleMiddleware(['nurse']),
  accessMiddleware.checkChildAccess(),
  childController.updateChild
)

router.patch(
  '/:id/discharge',
  auth,
 roleMiddleware(['nurse']),
 accessMiddleware.checkChildAccess(),
  childController.dischargeChild
) 

module.exports = router