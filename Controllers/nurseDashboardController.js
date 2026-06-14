const Child = require('../Models/Child')
const Alert = require('../Models/Alert')
const Sensor = require('../Models/Sensor')
const mongoose = require('mongoose')
const { getAccessibleChildIds } = require('../Utils/alertAccessFilter')
const { formatNurseDashboard } = require('../Utils/dto/nurseDashboard.dto')

// ================= NURSE DASHBOARD =================
exports.getNurseDashboard = async (req, res) => {
  try {

    const role = req.user.role?.toLowerCase()

    if (role !== 'nurse') {
      return res.status(403).json({
        status: "error",
        message: "Only nurses can access this dashboard"
      })
    }

    // 1. get allowed children
    const childIds = await getAccessibleChildIds(req.user)

    if (!childIds.length) {
      return res.status(200).json({
        status: "success",
        data: {
          totalChildren: 0,
          activeAlerts: 0,
          children: [],
          alerts: [],
          latestSensors: []
        }
      })
    }

    const childObjectIds = childIds.map(id =>
      new mongoose.Types.ObjectId(id)
    )

    // ================= CHILDREN =================
    const children = await Child.find({
      _id: { $in: childObjectIds },
      status: "active"
    })
    // .populate('incubatorId', 'incubatorName')

    // ================= ALERTS =================
    const alerts = await Alert.find({
  childId: { $in: childObjectIds },
  targetRole: 'nurse',   // 👈 هذا أهم سطر بالنظام كله
  status: 'active'
})
.sort({ createdAt: -1 })
.limit(10)

    // ================= LATEST SENSOR PER CHILD =================
    const latestSensorsRaw = await Sensor.aggregate([
      { $match: { childId: { $in: childObjectIds } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$childId",
          data: { $first: "$$ROOT" }
        }
      }
    ])

    const latestSensors = latestSensorsRaw.map(item => ({
      childId: item._id,
      data: item.data
    }))

    return res.status(200).json({
  status: "success",
  data: formatNurseDashboard({
    summary: {
      totalChildren: children.length,
      activeAlerts: alerts.length
    },
    children,
    alerts,
    latestSensors
  })
})

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}