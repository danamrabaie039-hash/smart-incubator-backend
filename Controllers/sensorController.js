const Sensor = require('../Models/Sensor')
const Incubator = require('../Models/Incubator')
const Child = require('../Models/Child')
const Alert = require('../Models/Alert')
const { evaluateAlerts } = require('../Utils/alertRules')
const { getIncubatorRules } = require('../Utils/incubatorRules')

const resolveAlertsIfRecovered = async (sensor, childId) => {

  const activeAlerts = await Alert.find({
    childId,
    status: "active"
  })

  for (const alert of activeAlerts) {

    let shouldResolve = false

    switch (alert.alertType) {

      // 🟢 MEDICAL
      case "baby_high_temperature":
        if (sensor.babyTemperature <= 37.5) shouldResolve = true
        break

      case "baby_low_temperature":
        if (sensor.babyTemperature >= 36.5) shouldResolve = true
        break

      case "low_oxygen":
        if (sensor.oxygenSaturation >= 92) shouldResolve = true
        break

      case "high_heart_rate":
        if (sensor.heartRate <= 160) shouldResolve = true
        break

      case "low_heart_rate":
        if (sensor.heartRate >= 120) shouldResolve = true
        break

      // 🟡 ENGINEER
      case "incubator_high_temperature":
        if (sensor.incubatorTemperature <= 39) shouldResolve = true
        break

      case "high_humidity":
        if (sensor.humidity <= 70) shouldResolve = true
        break

      case "gas_detected":
        if (sensor.gas === 0) shouldResolve = true
        break

      case "alarm_active":
        if (sensor.alarmActive === false) shouldResolve = true
        break
    }

    if (shouldResolve && alert.status === "active") {
      alert.status = "resolved"
      alert.resolvedAt = new Date()
      await alert.save()
    }
  }
}

exports.createSensorData = async (req, res) => {
  try {
     // 👇 هون بتحط الفحص هذا
    const body = req.body;

  if (!body || Object.keys(body).length === 0) {
  return res.status(400).json({
    status: "error",
    message: "Empty or invalid request body"
  });
}

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
    } = body;

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
     const rules = getIncubatorRules(child.birthWeek)

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

const activeAlerts = await Alert.find({
  childId: child._id,
  status: "active"
})

const { alertsToCreate, alertsToResolve } =
  evaluateAlerts({
    incubatorTemperature,
    babyTemperature,
    humidity,
    oxygenSaturation,
    heartRate,
    gas,
    alarmActive
  }, activeAlerts,
      rules )

const createdAlerts = []


    for (const alert of alertsToCreate) {

      const newAlert = await Alert.create({
        childId: child._id,
        incubatorId: incubator._id,
        alertType: alert.alertType,
        alertLevel: alert.level,
        targetRole: alert.targetRole,
        message: alert.message,
        status: "active",
         sensorSnapshot: alert.targetRole === 'nurse'
      ? {
          babyTemperature,
          oxygenSaturation,
          heartRate
        }
      : {
          incubatorTemperature,
          humidity,
          gas,
          alarmActive
        }
  })

  createdAlerts.push(newAlert)
}

await resolveAlertsIfRecovered(
  {
    incubatorTemperature,
    babyTemperature,
    humidity,
    oxygenSaturation,
    heartRate,
    gas,
    alarmActive
  },
  child._id
)

const io = req.app.get('io')

io.emit('sensor-update', {
  sensor,
  alerts: createdAlerts
})
// ================= RESOLVE =================
// await Alert.updateMany(
//   {
//     childId: child._id,
//     status: "active",
//     alertType: { $in: alertsToResolve }
//   },
//   {
//     status: "resolved",
//     resolvedAt: new Date()
//   }
// )
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
    incubatorTemperature: sensor.incubatorTemperature,
    humidity: sensor.humidity,

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