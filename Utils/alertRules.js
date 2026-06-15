// ================= ALERT ENGINE (STATE-AWARE) =================

const evaluateAlerts = (sensor, activeAlerts = []) => {

  const alertsToCreate = []
  const alertsToResolve = []

  const {
    babyTemperature,
    oxygenSaturation,
    heartRate,
    incubatorTemperature,
    humidity,
    gas,
    alarmActive
  } = sensor

  // ================= MEDICAL ALERTS =================

  // BABY TEMP HIGH
  if (babyTemperature > 37.5) {

    const exists = activeAlerts.find(a => a.alertType === "baby_high_temperature")

    if (!exists) {
      alertsToCreate.push({
        alertType: "baby_high_temperature",
        level: "high",
        targetRole: "nurse",
        message: "High baby temperature detected"
      })
    }

  } else {
    alertsToResolve.push("baby_high_temperature")
  }

  // BABY TEMP LOW
  if (babyTemperature < 36.5) {

    const exists = activeAlerts.find(a => a.alertType === "baby_low_temperature")

    if (!exists) {
      alertsToCreate.push({
        alertType: "baby_low_temperature",
        level: "high",
        targetRole: "nurse",
        message: "Low baby temperature detected"
      })
    }

  } else {
    alertsToResolve.push("baby_low_temperature")
  }

  // OXYGEN
  if (oxygenSaturation < 92) {

    const exists = activeAlerts.find(a => a.alertType === "low_oxygen")

    if (!exists) {
      alertsToCreate.push({
        alertType: "low_oxygen",
        level: "critical",
        targetRole: "nurse",
        message: "Low oxygen saturation detected"
      })
    }

  } else {
    alertsToResolve.push("low_oxygen")
  }

  // HEART HIGH
  if (heartRate > 160) {

    const exists = activeAlerts.find(a => a.alertType === "high_heart_rate")

    if (!exists) {
      alertsToCreate.push({
        alertType: "high_heart_rate",
        level: "critical",
        targetRole: "nurse",
        message: "High heart rate detected"
      })
    }

  } else {
    alertsToResolve.push("high_heart_rate")
  }

  // HEART LOW
  if (heartRate < 120) {

    const exists = activeAlerts.find(a => a.alertType === "low_heart_rate")

    if (!exists) {
      alertsToCreate.push({
        alertType: "low_heart_rate",
        level: "high",
        targetRole: "nurse",
        message: "Low heart rate detected"
      })
    }

  } else {
    alertsToResolve.push("low_heart_rate")
  }

  // ================= ENGINEER ALERTS =================

  if (incubatorTemperature > 39) {

    const exists = activeAlerts.find(a => a.alertType === "incubator_high_temperature")

    if (!exists) {
      alertsToCreate.push({
        alertType: "incubator_high_temperature",
        level: "high",
        targetRole: "engineer",
        message: "Incubator overheating detected"
      })
    }

  } else {
    alertsToResolve.push("incubator_high_temperature")
  }

  if (humidity > 70) {

    const exists = activeAlerts.find(a => a.alertType === "high_humidity")

    if (!exists) {
      alertsToCreate.push({
        alertType: "high_humidity",
        level: "medium",
        targetRole: "engineer",
        message: "High humidity detected"
      })
    }

  } else {
    alertsToResolve.push("high_humidity")
  }

  if (gas === true || gas > 600) {

    const exists = activeAlerts.find(a => a.alertType === "gas_detected")

    if (!exists) {
      alertsToCreate.push({
        alertType: "gas_detected",
        level: "critical",
        targetRole: "engineer",
        message: "Gas detected inside incubator"
      })
    }

  } else {
    alertsToResolve.push("gas_detected")
  }

  if (alarmActive === true) {

    const exists = activeAlerts.find(a => a.alertType === "alarm_active")

    if (!exists) {
      alertsToCreate.push({
        alertType: "alarm_active",
        level: "medium",
        targetRole: "engineer",
        message: "System alarm is active"
      })
    }

  } else {
    alertsToResolve.push("alarm_active")
  }

  return {
    alertsToCreate,
    alertsToResolve
  }
}

module.exports = {
  evaluateAlerts
}