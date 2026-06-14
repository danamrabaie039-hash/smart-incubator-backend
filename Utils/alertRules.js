// ================= MEDICAL ALERTS (NURSE) =================
const getMedicalAlerts = (sensor) => {

  const alerts = []

  const {
    babyTemperature,
    oxygenSaturation,
    heartRate
  } = sensor

  if (babyTemperature > 37.5) {
    alerts.push({
      alertType: "baby_high_temperature",
      level: "high",
      targetRole: "nurse",
      message: "High baby temperature detected"
    })
  } else if (babyTemperature < 36.5) {
    alerts.push({
      alertType: "baby_low_temperature",
      level: "high",
      targetRole: "nurse",
      message: "Low baby temperature detected"
    })
  }

  if (oxygenSaturation < 92) {
    alerts.push({
      alertType: "low_oxygen",
      level: "critical",
      targetRole: "nurse",
      message: "Low oxygen saturation detected"
    })
  }

  if (heartRate > 160) {
    alerts.push({
      alertType: "high_heart_rate",
      level: "critical",
      targetRole: "nurse",
      message: "High heart rate detected"
    })
  } else if (heartRate < 120) {
    alerts.push({
      alertType: "low_heart_rate",
      level: "high",
      targetRole: "nurse",
      message: "Low heart rate detected"
    })
  }

  return alerts
}


// ================= ENGINEER ALERTS (SYSTEM) =================
const getEngineerAlerts = (sensor) => {

  const alerts = []

  const {
    incubatorTemperature,
    humidity,
    gas,
    alarmActive
  } = sensor

  if (incubatorTemperature > 39) {
    alerts.push({
      alertType: "incubator_high_temperature",
      level: "high",
      targetRole: "engineer",
      message: "Incubator overheating detected"
    })
  }

  if (humidity > 70) {
    alerts.push({
      alertType: "high_humidity",
      level: "medium",
      targetRole: "engineer",
      message: "High humidity detected"
    })
  }

  if (gas === true) {
    alerts.push({
      alertType: "gas_detected",
      level: "critical",
      targetRole: "engineer",
      message: "Gas detected inside incubator"
    })
  }

  if (alarmActive === true) {
    alerts.push({
      alertType: "alarm_active",
      level: "medium",
      targetRole: "engineer",
      message: "System alarm is active"
    })
  }

  return alerts
}

module.exports = {
  getMedicalAlerts,
  getEngineerAlerts
}