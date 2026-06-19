const Incubator = require('../Models/Incubator')
const AUTH_TOKEN = "ICU_CAM_2026_SECRET"

// ================= REGISTER CAMERA =================
exports.registerCamera = async (req, res) => {
  try {

        // 🔐 AUTH CHECK
    if (req.headers.authorization !== `Bearer ${AUTH_TOKEN}`) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized"
      })
    }
    const { incubatorId, cameraUrl } = req.body

    if (!incubatorId || !cameraUrl) {
      return res.status(400).json({
        status: "error",
        message: "Missing data"
      })
    }

    const incubator = await Incubator.findByIdAndUpdate(
      incubatorId,
      {
        cameraUrl,
        connectionStatus: "online",
        lastUpdate: new Date()
      },
      { new: true }
    )

    if (!incubator) {
      return res.status(404).json({
        status: "error",
        message: "Incubator not found"
      })
    }

    return res.json({
      status: "success",
      message: "Camera registered successfully",
      data: incubator
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}