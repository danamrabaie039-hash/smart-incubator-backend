const Access = require('../Models/UserChildAccess')

exports.checkChildAccess = function () {

  return async function (req, res, next) {

    try {

      const role = req.user.role?.toLowerCase()

      // Doctor can access all children
      if (role === 'doctor') {
        return next()
      }

      // Only nurses use access table
      if (role !== 'nurse') {
        return res.status(403).json({
          status: 'error',
          message: 'Not allowed'
        })
      }

      const childId = req.params.id

      const access = await Access.findOne({
        userId: req.user._id,
        childId,
        accessStatus: 'active'
      })

      if (!access) {
        return res.status(403).json({
          status: 'error',
          message: 'No access to this child'
        })
      }

      req.access = access
      req.childId = childId

      next()

    } catch (error) {

      return res.status(500).json({
        status: 'error',
        message: error.message
      })

    }

  }

}