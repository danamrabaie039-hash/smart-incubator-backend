function formatNurseDashboard(data) {
  return {
    summary: data.summary,

    children: data.children,

    alerts: data.alerts.map(a => ({
      id: a._id,
      type: a.alertType,
      level: a.alertLevel,
      message: a.message,
      createdAt: a.createdAt
    })),

    latestSensors: data.latestSensors.map(s => ({
      childId: s.childId,
      incubatorId: s.data.incubatorId,
      babyTemperature: s.data.babyTemperature,
      oxygenSaturation: s.data.oxygenSaturation,
      heartRate: s.data.heartRate
    }))
  }
}

module.exports = { formatNurseDashboard }