const Maintenance = require('../Models/Maintenance')
const Sensor = require('../Models/Sensor')
const Alert = require('../Models/Alert')
const { formatEngineerDashboard } = require('../Utils/dto/engineerDashboard.dto')
exports.getEngineerDashboard = async (req, res) => {
  try {

    const engineerId = req.user._id

    // ================= MAINTENANCE =================
    const total = await Maintenance.countDocuments({ engineerId, isArchived: false })
    const pending = await Maintenance.countDocuments({ engineerId, isArchived: false, status: 'pending' })
    const inProgress = await Maintenance.countDocuments({ engineerId, isArchived: false, status: 'in_progress' })
    const resolved = await Maintenance.countDocuments({ engineerId, isArchived: false, status: 'resolved' })

    const latestMaintenance = await Maintenance.find({
      engineerId,
      isArchived: false
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('incubatorId', 'incubatorName')

    // ================= ALERTS =================
    const alerts = await Alert.find({
      targetRole: 'engineer',
      status: 'active'
    })
      .sort({ createdAt: -1 })
      .limit(10)

    // ================= REAL-TIME SYSTEM STATUS =================
    const latestSensors = await Sensor.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$incubatorId",
          data: { $first: "$$ROOT" }
        }
      }
    ])

    const systemStatus = latestSensors.map(item => ({
      incubatorId: item._id,
      incubatorTemperature: item.data.incubatorTemperature,
      humidity: item.data.humidity,
      fan: item.data.fan,
      heater: item.data.heater,
      humidifier: item.data.humidifier,
      gas: item.data.gas,
      alarmActive: item.data.alarmActive
    }))

    return res.json({
      status: 'success',
      data: formatEngineerDashboard( {
        summary: {
          total,
          pending,
          inProgress,
          resolved
        },
        systemStatus,
        latestMaintenance,
        alerts   // 👈 مهم جداً
      })
    })

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}