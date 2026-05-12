const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {

    const fullToken = req.headers.authorization

    if (!fullToken) {
      return res.status(401).json({ message: "No token provided" })
    }

    const token = fullToken.split(' ')[1]

    const decoded = jwt.verify(token, 'incubator_secret_key')

    req.user = decoded

    next()

  } catch (error) {
    res.status(401).json({ message: "Invalid Token" })
  }
}