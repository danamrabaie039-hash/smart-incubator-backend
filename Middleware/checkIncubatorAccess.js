// Middleware/checkIncubatorAccess.js

const Child = require('../Models/Child')
const Access = require('../Models/UserChildAccess')

module.exports = async (req, res, next) => {
  try {

    // المهندس مسموح له يشوف كل الحاضنات
    if (req.user.role?.toLowerCase() === 'engineer') {
      return next()
    }

    const child = await Child.findOne({
      incubatorId: req.params.incubatorId
    })

    if (!child) {
      return res.status(404).json({
        status: 'error',
        message: 'No child assigned'
      })
    }

    const access = await Access.findOne({
      userId: req.user._id,
      childId: child._id,
      accessStatus: 'active'
    })

    if (!access) {
      return res.status(403).json({
        status: 'error',
        message: 'No access to this child'
      })
    }

    next()

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}