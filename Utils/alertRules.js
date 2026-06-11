// ================= ALERT ENGINE =================

exports.calculateAlertLevel = (sensor) => {


  const alerts = []

  const {
    incubatorTemperature,
    babyTemperature,
    oxygenSaturation,
    heartRate,
    soundLevel
  } = sensor


  // ================= TEMPERATURE =================
if (incubatorTemperature >= 40) {

  alerts.push({
    type: "high_temperature",
    level: "critical",
    message: "Dangerous incubator temperature detected"
  })

} else if (incubatorTemperature >= 39) {

  alerts.push({
    type: "high_temperature",
    level: "high",
    message: "Critical incubator temperature detected"
  })

} else if (incubatorTemperature >= 38) {

  alerts.push({
    type: "high_temperature",
    level: "medium",
    message: "Moderate incubator temperature rise detected"
  })
}

if (babyTemperature >= 38) {

  alerts.push({
    type: "high_temperature",
    level: "critical",
    message: "Dangerous baby temperature detected"
  })

} else if (babyTemperature >= 37.5) {

  alerts.push({
    type: "high_temperature",
    level: "high",
    message: "High baby temperature detected"
  })

} else if (babyTemperature >= 37) {

  alerts.push({
    type: "high_temperature",
    level: "medium",
    message: "Slightly elevated baby temperature detected"
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

  if (sensor.humidity > 65) {
  alerts.push({
    type: 'high_humidity',
    level: 'high',
    message: 'High humidity detected'
  })
}
// ================= GAS =================
if (sensor.gasDetected === true) {
  alerts.push({
    type: 'gas_detected',
    level: 'critical',
    message: 'Gas detected inside incubator'
  })
}

// ================= WATER LEVEL =================
if (sensor.waterLevel <= 20) {
  alerts.push({
    type: 'low_water_level',
    level: 'high',
    message: 'Water level is low'
  })
}

  return alerts
}