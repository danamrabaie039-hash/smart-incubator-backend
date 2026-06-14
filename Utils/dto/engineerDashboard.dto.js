function formatEngineerDashboard(data) {
  return {
    summary: data.summary,

    systemStatus: data.systemStatus.map(s => ({
      incubatorId: s.incubatorId,
      incubatorTemperature: s.incubatorTemperature,
      humidity: s.humidity,
      fan: s.fan,
      heater: s.heater,
      humidifier: s.humidifier,
      gas: s.gas,
      alarmActive: s.alarmActive
    })),

    alerts: data.alerts.map(a => ({
      id: a._id,
      type: a.alertType,
      level: a.alertLevel,
      message: a.message,
      createdAt: a.createdAt
    })),

    latestMaintenance: data.latestMaintenance.map(m => ({
      id: m._id,
      incubatorName: m.incubatorId?.incubatorName,
      status: m.status,
      issueDescription: m.issueDescription,
      actionTaken: m.actionTaken,
      createdAt: m.createdAt
    }))
  }
}

module.exports = { formatEngineerDashboard }