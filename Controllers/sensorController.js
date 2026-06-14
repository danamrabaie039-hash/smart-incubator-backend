const Sensor = require('../Models/Sensor')
const Incubator = require('../Models/Incubator')
const Child = require('../Models/Child')
const Alert = require('../Models/Alert')
const { getMedicalAlerts, getEngineerAlerts } = require('../Utils/alertRules')

exports.createSensorData = async (req, res) => {
  try {

    const {
      incubatorTemperature,
      babyTemperature,
      humidity,
      oxygenSaturation,
      heartRate,
      heater,
      fan,
      humidifier,
      gas,
      alarmActive
    } = req.body

    const incubator = req.incubator

    if (!incubator) {
      return res.status(401).json({
        status: "error",
        message: "Device not authorized"
      })
    }

    const child = await Child.findOne({ incubatorId: incubator._id })

    if (!child) {
      return res.status(404).json({
        status: "error",
        message: "No child assigned"
      })
    }

    // ================= SAVE SENSOR =================
    const sensor = await Sensor.create({
      incubatorId: incubator._id,
      childId: child._id,
      incubatorTemperature,
      babyTemperature,
      humidity,
      oxygenSaturation,
      heartRate,
      heater,
      fan,
      humidifier,
      gas,
      alarmActive
    })

    await Incubator.findByIdAndUpdate(incubator._id, {
      lastUpdate: new Date()
    })

    // ================= ALERT ENGINE =================
    const medicalAlerts = getMedicalAlerts({
      babyTemperature,
      oxygenSaturation,
      heartRate
    })

    const engineerAlerts = getEngineerAlerts({
      incubatorTemperature,
      humidity,
      gas,
      alarmActive
    })

    // 👉 الدمج حسب النظام (حاليًا الاثنين معًا)
    const alerts = [...medicalAlerts, ...engineerAlerts]

    const createdAlerts = []

    const nurseSnapshot = {
  babyTemperature,
  oxygenSaturation,
  heartRate
}

const engineerSnapshot = {
  incubatorTemperature,
  humidity,
  gas,
  alarmActive
}

    for (const alert of alerts) {

      const existingAlert = await Alert.findOne({
        childId: child._id,
        alertType: alert.alertType,
        status: "active"
      })

      if (existingAlert) continue

      const newAlert = await Alert.create({
        childId: child._id,
        incubatorId: incubator._id,
        alertType: alert.alertType,
        alertLevel: alert.level,
        targetRole: alert.targetRole,
        message: alert.message,
        status: "active",
        sensorSnapshot:
      alert.targetRole === 'nurse'
    ? nurseSnapshot
    : engineerSnapshot
      })

      createdAlerts.push(newAlert)
    }

    return res.status(201).json({
      status: "success",
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
// ================= NURSE VIEW =================
exports.getNurseSensorView = async (req, res) => {
  try {

    const sensor = await Sensor.findOne({ childId: req.params.id })
      .sort({ createdAt: -1 })

    if (!sensor) {
      return res.status(404).json({
        status: "error",
        message: "No sensor data"
      })
    }

    return res.json({
      status: "success",
      data: {
        babyTemperature: sensor.babyTemperature,
        oxygenSaturation: sensor.oxygenSaturation,
        heartRate: sensor.heartRate
      }
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}
// ================= ENGINEER VIEW =================
exports.getEngineerSensorView = async (req, res) => {
  try {

    const sensor = await Sensor.findOne({ incubatorId: req.params.id })
      .sort({ createdAt: -1 })

    if (!sensor) {
      return res.status(404).json({
        status: "error",
        message: "No sensor data"
      })
    }

    return res.json({
      status: "success",
      data: {
        heater: sensor.heater,
        fan: sensor.fan,
        humidifier: sensor.humidifier,
        gas: sensor.gas,
        alarmActive: sensor.alarmActive
      }
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}
// ================= LATEST SENSOR =================
exports.getLatestSensorByIncubator = async (req, res) => {

  try {

    const sensor = await Sensor.findOne({
      incubatorId: req.params.incubatorId
    }).sort({ createdAt: -1 })

    if (!sensor) {
      return res.status(404).json({
        status: "error",
        message: "No sensor data found"
      })
    }

    return res.json({
      status: "success",
      data: sensor
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}