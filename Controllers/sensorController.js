const Sensor = require('../Models/Sensor')
const Incubator = require('../Models/Incubator')
const Child = require('../Models/Child')
const Alert = require('../Models/Alert')
const { calculateAlertLevel } = require('../Utils/alertRules')


// ================= CREATE SENSOR DATA =================
exports.createSensorData = async (req, res) => {
  try {

    const {
      incubatorTemperature,
      babyTemperature,
      humidity,
      oxygenSaturation,
      heartRate,
      soundLevel,
      heater,
      fan,
      humidifier,
      exhaust,
      waterLevel,
      gasDetected,
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

    const sensor = await Sensor.create({
      incubatorId: incubator._id,
      childId: child._id,
      incubatorTemperature,
      babyTemperature,
      humidity,
      oxygenSaturation,
      heartRate,
      soundLevel,
      heater,
      fan,
      humidifier,
      exhaust,
      waterLevel,
      gasDetected,
      alarmActive
    })

    await Incubator.findByIdAndUpdate(incubator._id, {
      lastUpdate: new Date()
    })

    const alerts = calculateAlertLevel({
      incubatorTemperature,
      babyTemperature,
      humidity,
      oxygenSaturation,
      heartRate,
      soundLevel,
      gasDetected,
      alarmActive,
      waterLevel
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
        incubatorId: incubator._id,
        alertType: alert.type,
        alertLevel: alert.level,
        message: alert.message,
        status: "active",
        sensorSnapshot: {
          incubatorTemperature,
          babyTemperature,
          humidity,
          oxygenSaturation,
          heartRate,
          soundLevel,
          gasDetected,
          alarmActive,
          waterLevel
        }
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
        heartRate: sensor.heartRate,
        humidity: sensor.humidity,
        incubatorTemperature: sensor.incubatorTemperature,
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
        exhaust: sensor.exhaust,
        waterLevel: sensor.waterLevel,
        gasDetected: sensor.gasDetected,
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


// ================= RAW DATA =================
exports.getSensorRaw = async (req, res) => {
  try {

    const data = await Sensor.find({
      incubatorId: req.params.id
    }).sort({ createdAt: -1 })

    return res.json({
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
exports.getLatestSensorByIncubator = async (req, res) => {

  try {

    const { incubatorId } = req.params

    // 1. check incubator
    const incubator = await Incubator.findById(incubatorId)

    if (!incubator) {
      return res.status(404).json({
        status: "error",
        message: "Incubator not found"
      })
    }

    // 2. get latest sensor reading
    const sensor = await Sensor.findOne({ incubatorId })
      .sort({ createdAt: -1 })

    if (!sensor) {
      return res.status(404).json({
        status: "error",
        message: "No sensor data found"
      })
    }

    // 3. get child
    const child = await Child.findOne({ incubatorId })

    return res.status(200).json({
      status: "success",
      data: {
        sensor,
        incubator: {
          id: incubator._id,
          name: incubator.incubatorName,
          status: incubator.status,
          connectionStatus: incubator.connectionStatus
        },
        child: child ? {
          id: child._id,
          name: child.childName
        } : null
      }
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}