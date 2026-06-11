const Child = require('../Models/Child')
const Alert = require('../Models/Alert')
const Sensor = require('../Models/Sensor')
const Access = require('../Models/UserChildAccess')
const { getAccessibleChildIds } = require('../Utils/alertAccessFilter')


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
          alerts: []
        }
      })
    }

    // ================= CHILDREN =================
    const children = await Child.find({
      _id: { $in: childIds },
      status: "active"
    }).populate('incubatorId', 'incubatorName')

    // ================= ALERTS =================
    const alerts = await Alert.find({
      childId: { $in: childIds },
      status: "active"
    })
      .populate("childId", "childName")
      .populate("incubatorId", "incubatorName")
      .sort({ createdAt: -1 })
      .limit(10)
// ================= LATEST SENSOR PER CHILD (OPTIMIZED) =================
const latestSensorsRaw = await Sensor.aggregate([
  { $match: { childId: { $in: childIds } } },
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
      data: {
        summary: {
          totalChildren: children.length,
          activeAlerts: alerts.length
        },
        children,
        alerts,
        latestSensors
      }
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}