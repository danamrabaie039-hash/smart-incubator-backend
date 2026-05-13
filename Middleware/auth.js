const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {

const authHeader = req.headers.authorization

if (!authHeader || !authHeader.startsWith("Bearer ")) {
  return res.status(401).json({ message: "No token provided" })
}

const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token, 'incubator_secret_key')

    req.user = decoded

    next()

  } catch (error) {
    res.status(401).json({ message: "Invalid Token" })
  }
}