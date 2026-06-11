module.exports = (roles = []) => {

  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized"
      })
    }

    const userRole = (req.user.role || "").toLowerCase()

    // 🟢 1. System validation (ONLY once)
    const validRoles = ['admin', 'nurse', 'doctor', 'engineer']

    if (!validRoles.includes(userRole)) {
      return res.status(403).json({
        status: "error",
        message: "Invalid role"
      })
    }

    // 🟡 2. Route-level authorization
    // إذا الراوت ما محدد roles → يسمح لكل valid roles
    if (roles.length && !roles.includes(userRole)) {
      return res.status(403).json({
        status: "error",
        message: "Forbidden - insufficient permissions"
      })
    }

    next()
  }
}
