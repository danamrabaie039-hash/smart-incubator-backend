const Incubator = require('../Models/Incubator')
const crypto = require('crypto')
// CREATE
exports.createIncubator = async (req, res) => {
  try {

    const {
      incubatorName,
      cameraUrl,
      status,
      connectionStatus
    } = req.body


  const existing = await Incubator.findOne({ incubatorName })

  if (existing) {
  return res.status(400).json({
    status: "error",
    message: "Incubator name already exists"
  })
 }
     // 👇 (2) هون توليد الـ apiKey داخل الدالة
    const apiKey = crypto.randomBytes(16).toString('hex')
    const incubator = await Incubator.create({
      incubatorName,
      cameraUrl,
      status: status || "active",
      connectionStatus: connectionStatus || "offline",
      isOccupied: false,
      lastUpdate: new Date(),
      apiKey // 👈 (3) هون انضاف داخل الداتا
    })

    return res.status(201).json({
      status: "success",
      data: incubator
    })

  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: err.message
    })
  }
}
// GET ALL
exports.getAllIncubators = async (req, res) => {
  try {

    const data = await Incubator.find()
      .sort({ createdAt: -1 })

    return res.status(200).json({
      status: "success",
      results: data.length,
      data
    })

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    })
  }
}

// GET BY ID
exports.getIncubatorById = async (req, res) => {
  try {

    const data = await Incubator.findById(req.params.id)

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "Incubator not found"
      })
    }

    return res.status(200).json({
      status: "success",
      data
    })

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    })
  }
}

exports.setMaintenanceMode = async (req, res) => {
  try {

    const incubator = await Incubator.findById(req.params.id)

    if (!incubator) {
      return res.status(404).json({
        status: "error",
        message: "Incubator not found"
      })
    }

    if (incubator.isOccupied) {
      return res.status(400).json({
        status: "error",
        message: "Cannot set occupied incubator to maintenance mode"
      })
    }

    incubator.status = "maintenance"
    incubator.isOccupied = false
    incubator.lastMaintenanceDate = new Date()
    incubator.lastUpdate = new Date()

    await incubator.save()

    return res.status(200).json({
      status: "success",
      message: "Incubator set to maintenance mode",
      data: incubator
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}


// UPDATE
exports.updateIncubator = async (req, res) => {
  try {

    const allowedFields = [
      "incubatorName",
      "status",
      "connectionStatus",
      "cameraUrl",
      
    ]

    const updates = {}

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    })

    updates.lastUpdate = new Date()

    const data = await Incubator.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    )

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "Incubator not found"
      })
    }

    return res.status(200).json({
      status: "success",
      data
    })

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    })
  }
}

exports.setMaintenanceMode = async (req, res) => {
  try {

    const updated = await Incubator.findByIdAndUpdate(
      req.params.id,
      {
        status: "maintenance",
        isOccupied: false,
        lastMaintenanceDate: new Date(),
        lastUpdate: new Date()
      },
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({
        status: "error",
        message: "Incubator not found"
      })
    }

    return res.status(200).json({
      status: "success",
      message: "Incubator set to maintenance mode",
      data: updated
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}