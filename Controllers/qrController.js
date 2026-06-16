const Child = require('../Models/Child')
const Incubator = require('../Models/Incubator')

// ================= QR SCAN =================
exports.openCameraFromQR = async (req, res) => {

  try {

    const { token } = req.params

    // 1) find child by qrToken
    const child = await Child.findOne({ qrToken: token })

    // 🚨 check QR validity
    if (!child || !child.qrToken) {
      return res.status(410).json({
        status: "error",
        message: "QR expired or invalid"
      })
    }

    // 2) check if active
    if (child.status !== "active") {
      return res.status(400).json({
        status: "error",
        message: "Child is not active"
      })
    }

    // 3) get incubator
    const incubator = await Incubator.findById(child.incubatorId)

    if (!incubator || !incubator.cameraUrl) {
      return res.status(404).json({
        status: "error",
        message: "Camera not found"
      })
    }

    // 4) redirect to camera
    return res.redirect(incubator.cameraUrl)

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}