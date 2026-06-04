const Access = require('../Models/UserChildAccess')

exports.checkChildAccess = function () {

  return async function (req, res, next) {

    try {

      const userId = req.user._id
      const role = req.user.role

      // const childId =
      //   req.params.childId ||
      //   req.params.id ||
      //   req.body.childId


const incubatorId = req.params.id

const Child = require('../Models/Child')

const child = await Child.findOne({ incubatorId })

if (!child) {
  return res.status(404).json({
    status: "error",
    message: "No child assigned to this incubator"
  })
}

const childId = child._id

      // ================= ADMIN BYPASS =================
      if (role === "admin") {
        return next()
      }

      // ================= VALIDATE CHILD ID =================
      if (!childId) {
        return res.status(400).json({
          status: "error",
          message: "Child ID is required"
        })
      }

      // ================= CHECK OWNERSHIP =================
      const access = await Access.findOne({
        userId,
        childId,
        accessStatus: "active"
      })

      if (!access) {
        return res.status(403).json({
          status: "error",
          message: "No access to this child"
        })
      }

      // ================= ATTACH ACCESS =================
      req.access = access
      req.childId = childId

      next()

    } catch (error) {

      return res.status(500).json({
        status: "error",
        message: error.message
      })

    }
  }
}