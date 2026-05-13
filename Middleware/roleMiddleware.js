module.exports = (roles) => {

  return (req, res, next) => {

    // user not logged in
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      })
    }

    // normalize role
    const userRole = req.user.role.toLowerCase()

    // check permission
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied"
      })
    }

    next()
  }
}