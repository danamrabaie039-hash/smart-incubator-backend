const Incubator = require('../Models/Incubator')

module.exports = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key']

    if (!apiKey) {
      return res.status(401).json({
        status: "error",
        message: "Missing API key"
      })
    }

    const incubator = await Incubator.findOne({ apiKey })

    if (!incubator) {
      return res.status(401).json({
        status: "error",
        message: "Invalid API key"
      })
    }

    if (incubator.status !== "active") {
  return res.status(403).json({
    status: "error",
    message: "Incubator not active"
  })
}

    // 🔥 نخزن الحاضنة عشان controller يستخدمها
    req.incubator = incubator

    next()

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}