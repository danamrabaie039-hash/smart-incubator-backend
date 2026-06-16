const Incubator = require('../Models/Incubator')

// ================= REGISTER CAMERA =================
exports.registerCamera = async (req, res) => {
  try {

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