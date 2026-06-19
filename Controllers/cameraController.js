const Incubator = require("../Models/Incubator");
const axios = require("axios");

const AUTH_TOKEN = "ICU_CAM_2026_SECRET";


// ================= REGISTER CAMERA =================
exports.registerCamera = async (req, res) => {
  try {

    if (req.headers.authorization !== `Bearer ${AUTH_TOKEN}`) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized"
      });
    }

    const { incubatorId, cameraUrl } = req.body;

    if (!incubatorId || !cameraUrl) {
      return res.status(400).json({
        status: "error",
        message: "Missing data"
      });
    }

    const incubator = await Incubator.findByIdAndUpdate(
      incubatorId,
      {
        cameraUrl,
        connectionStatus: "online",
        lastUpdate: new Date()
      },
      { new: true }
    );

    if (!incubator) {
      return res.status(404).json({
        status: "error",
        message: "Incubator not found"
      });
    }

    return res.json({
      status: "success",
      message: "Camera registered successfully",
      data: incubator
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};




// ================= STREAM CAMERA PROXY =================
exports.streamCamera = async (req, res) => {
  try {
    const { id } = req.params;

    const incubator = await Incubator.findById(id);

    if (!incubator) {
      return res.status(404).json({
        status: "error",
        message: "Incubator not found"
      });
    }

    // 👇 هنا أهم نقطة
    const ESP32_STREAM = "http://10.81.63.236:81/stream";

    const response = await axios({
      method: "GET",
      url: ESP32_STREAM,
      responseType: "stream",
      timeout: 15000
    });

    res.setHeader(
      "Content-Type",
      "multipart/x-mixed-replace; boundary=frame"
    );

    response.data.pipe(res);

  } catch (error) {
    console.log("STREAM ERROR:", error.message);

    res.status(500).json({
      status: "error",
      message: "Camera stream failed"
    });
  }
};