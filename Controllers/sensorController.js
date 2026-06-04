const Sensor = require('../Models/Sensor')
const Incubator = require('../Models/Incubator')
const Child = require('../Models/Child')
const Alert = require('../Models/Alert')

const { calculateAlertLevel } = require('../Utils/alertRules')


// ================= CREATE SENSOR DATA =================
exports.createSensorData = async (req, res) => {

  try {

    const {
      temperature,
      humidity,
      oxygenSaturation,
      heartRate,
      soundLevel
    } = req.body

    // 🔥 incubator comes from middleware (API KEY)
const incubator = req.incubator

if (!incubator) {
  return res.status(401).json({
    status: "error",
    message: "Device not authorized or incubator missing"
  })
}

const incubatorId = incubator._id

    // ================= 1. Get child =================
    const child = await Child.findOne({ incubatorId })
    console.log("🔥 CHILD CHECK:", child)

    if (!child) {
      return res.status(404).json({
        status: "error",
        message: "No child assigned"
      })
    }

    // ================= 2. Save sensor =================
    const sensor = await Sensor.create({
      incubatorId,
      childId: child._id,
      temperature,
      humidity,
      oxygenSaturation,
      heartRate,
      soundLevel
    })

    await Incubator.findByIdAndUpdate(incubatorId, {
      lastUpdate: new Date()
    })

    // ================= 3. ALERT ENGINE =================
    const alerts = calculateAlertLevel({
      temperature,
      humidity,
      oxygenSaturation,
      heartRate,
      soundLevel
    })

    const createdAlerts = []

    for (const alert of alerts) {

      const existingAlert = await Alert.findOne({
        childId: child._id,
        alertType: alert.type,
        status: "active"
      })

      if (existingAlert) continue

      const newAlert = await Alert.create({
        childId: child._id,
        incubatorId,
        alertType: alert.type,
        alertLevel: alert.level,
        message: alert.message,
        status: "active",
        sensorSnapshot: {
          temperature,
          humidity,
          oxygenSaturation,
          heartRate,
          soundLevel
        }
      })

      createdAlerts.push(newAlert)
    }

    return res.status(201).json({
      status: "success",
      message: "Sensor processed successfully",
      data: {
        sensor,
        alerts: createdAlerts
      }
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}


// ================= MOCK SENSOR DATA =================
exports.mockSensorData = async (req, res) => {

  try {

    const {
      incubatorId,
      temperature,
      oxygenSaturation,
      heartRate,
      humidity,
      soundLevel
    } = req.body

    // 1. check incubator
    const incubator = await Incubator.findById(incubatorId)

    if (!incubator) {
      return res.status(404).json({
        status: "error",
        message: "Incubator not found"
      })
    }

    // 2. save sensor reading
    const sensor = await Sensor.create({
      incubatorId,
      temperature,
      oxygenSaturation,
      heartRate,
      humidity,
      soundLevel
    })

    // 3. get child linked to incubator
    const child = await Child.findOne({ incubatorId })

    if (!child) {
      return res.status(404).json({
        status: "error",
        message: "No child assigned"
      })
    }

    // ================= ALERT ENGINE (same as real system) =================
    const alerts = calculateAlertLevel({
      temperature,
      humidity,
      oxygenSaturation,
      heartRate,
      soundLevel
    })

    const createdAlerts = []

    for (const alert of alerts) {

      const existingAlert = await Alert.findOne({
        childId: child._id,
        alertType: alert.type,
        status: "active"
      })

      if (existingAlert) continue

      const newAlert = await Alert.create({
        childId: child._id,
        incubatorId,
        alertType: alert.type,
        alertLevel: alert.level,
        message: alert.message,
        status: "active",
        sensorSnapshot: {
          temperature,
          humidity,
          oxygenSaturation,
          heartRate,
          soundLevel
        }
      })

      createdAlerts.push(newAlert)
    }

    return res.status(200).json({
      status: "success",
      message: "Sensor processed",
      data: {
        sensor,
        alerts: createdAlerts
      }
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}


// ================= GET SENSOR DATA BY INCUBATOR =================
exports.getSensorByIncubator = async (req, res) => {

  try {

    const data = await Sensor.find({
      incubatorId: req.params.id
    }).sort({ createdAt: -1 })

    return res.status(200).json({
      status: "success",
      results: data.length,
      data
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}


// ================= GET LATEST SENSOR =================
exports.getLatestSensorByIncubator = async (req, res) => {

  try {

    const data = await Sensor.findOne({
      incubatorId: req.params.id
    }).sort({ createdAt: -1 })

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "No sensor data found"
      })
    }

    return res.status(200).json({
      status: "success",
      data
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}


// ================= DASHBOARD =================
exports.getSensorDashboard = async (req, res) => {

  try {

    const incubatorId = req.params.id

    const latestSensor = await Sensor.findOne({
      incubatorId
    }).sort({ createdAt: -1 })

    const child = await Child.findOne({
      incubatorId
    })

    if (!child) {
      return res.status(404).json({
        status: "error",
        message: "No child assigned to this incubator"
      })
    }

    const accessList = await require('../Models/UserChildAccess').find({
      childId: child._id,
      accessStatus: "active"
    }).populate("userId")

    return res.status(200).json({
      status: "success",
      data: {
        sensor: latestSensor,
        child,
        accessList
      }
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}