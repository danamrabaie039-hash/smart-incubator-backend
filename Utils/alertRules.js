// ================= ALERT ENGINE =================

exports.calculateAlertLevel = (sensor) => {

  const alerts = []

  const {
    temperature,
    oxygenSaturation,
    heartRate,
    soundLevel
  } = sensor


  // ================= TEMPERATURE =================
  if (temperature >= 40) {

    alerts.push({
      type: "high_temperature",
      level: "critical",
      message: "Dangerous critical temperature detected"
    })

  } else if (temperature >= 39) {

    alerts.push({
      type: "high_temperature",
      level: "high",
      message: "Critical high temperature detected"
    })

  } else if (temperature >= 38) {

    alerts.push({
      type: "high_temperature",
      level: "medium",
      message: "Moderate temperature rise detected"
    })
  }


  // ================= OXYGEN =================
  if (oxygenSaturation < 85) {

    alerts.push({
      type: "low_oxygen",
      level: "critical",
      message: "Critical low oxygen level detected"
    })

  } else if (oxygenSaturation < 90) {

    alerts.push({
      type: "low_oxygen",
      level: "high",
      message: "Low oxygen level detected"
    })
  }


  // ================= HEART RATE =================
  if (heartRate > 170) {

    alerts.push({
      type: "high_heart_rate",
      level: "critical",
      message: "Dangerous heart rate detected"
    })

  } else if (heartRate > 160) {

    alerts.push({
      type: "high_heart_rate",
      level: "high",
      message: "High heart rate detected"
    })

  } else if (heartRate > 140) {

    alerts.push({
      type: "high_heart_rate",
      level: "medium",
      message: "Elevated heart rate detected"
    })
  }


  // ================= SOUND =================
  if (soundLevel > 80) {

    alerts.push({
      type: "sound_detected",
      level: "high",
      message: "High noise detected"
    })

  } else if (soundLevel > 70) {

    alerts.push({
      type: "sound_detected",
      level: "low",
      message: "Unusual sound detected"
    })
  }

  return alerts
}