const Alert = require('../Models/Alert')
const Access = require('../Models/UserChildAccess')
const Child = require('../Models/Child')
const { evaluateAlerts } = require("../Utils/alertRules")

// ================= ROLE CHECK =================
const canViewAlerts = (role, alertType) => {

  role = role.toLowerCase()

  if (role === "nurse") {
    return alertType.includes("baby") ||
           alertType.includes("heart") ||
           alertType.includes("oxygen")
  }

  if (role === "engineer") {
    return alertType.includes("incubator") ||
           alertType.includes("gas") ||
           alertType.includes("sensor") ||
           alertType.includes("alarm")
  }

  return false
}

// ================= GET ACCESSIBLE CHILD IDS =================
const getAccessibleChildIds = async (user) => {

   const role = user.role?.toLowerCase()

  // NURSE فقط
  if (role === "nurse") {
    const accessList = await Access.find({
      userId: user._id,
      accessStatus: "active"
    }).select("childId")

    return accessList.map(a => a.childId.toString())
  }

  // DOCTOR أو غيره ❌ لا شيء
  return []
}
// ================= GET ALL ALERTS =================
exports.getAllAlerts = async (req, res) => {

  try {


const role = req.user.role?.toLowerCase()
if (!canManageAlerts(role)) {
  return res.status(403).json({
    message: "Alerts not allowed for this role"
  })
}
    const childIds = await getAccessibleChildIds(req.user)

    const query = {
      childId: { $in: childIds }
    }

    if (req.query.status) {
      query.status = req.query.status
    }

    if (req.query.type) {
      query.alertType = req.query.type
    }

    const alerts = await Alert.find(query)
      .populate("childId", "childName")
      .populate("incubatorId", "incubatorName")
      .sort({ createdAt: -1 })

    return res.status(200).json({
      status: "success",
      results: alerts.length,
      data: alerts
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}
// ================= GET ACTIVE ALERTS =================
exports.getActiveAlerts = async (req, res) => {

  try {

const role = req.user.role?.toLowerCase()
if (!canManageAlerts(role)) {
  return res.status(403).json({
    message: "Alerts not allowed for this role"
  })
}
    

    const childIds = await getAccessibleChildIds(req.user)

    const alerts = await Alert.find({
      status: "active",
      childId: { $in: childIds }
    })
    .populate("childId", "childName")
    .populate("incubatorId", "incubatorName")
    .sort({ createdAt: -1 })

    return res.status(200).json({
      status: "success",
      results: alerts.length,
      data: alerts
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}
// ================= RESOLVE ALERT =================
exports.resolveAlert = async (req, res) => {

  try {

    const role = req.user.role?.toLowerCase()
    const userId = req.user._id

    // ================= ROLE CHECK =================
    if (!canManageAlerts(role)) {
  return res.status(403).json({
    message: "Alerts not allowed for this role"
  })
}

    const childIds = await getAccessibleChildIds(req.user)

const alert = await Alert.findOne({
  _id: req.params.id,
  childId: { $in: childIds }
})

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found"
      })
    }

    // ================= ACCESS CHECK =================
    // const access = await Access.findOne({
    //   userId,
    //   childId: alert.childId,
    //   accessStatus: "active"
    // })

    // if (!access) {
    //   return res.status(403).json({
    //     message: "No permission for this child's alerts"
    //   })
    // }

    // ================= UPDATE =================
    alert.status = "resolved"

    await alert.save()

    return res.status(200).json({
      status: "success",
      message: "Alert resolved successfully",
      data: alert
    })

  } catch (error) {

    return res.status(500).json({
      message: error.message
    })

  }
}


// ================= IGNORE ALERT =================
exports.ignoreAlert = async (req, res) => {

  try {

    const role = req.user.role?.toLowerCase()
    const userId = req.user._id

    // ================= ROLE CHECK =================
  if (!canManageAlerts(role)) {
  return res.status(403).json({
    message: "Alerts not allowed for this role"
  })
}
const childIds = await getAccessibleChildIds(req.user)
    const alert = await Alert.findOne({
  _id: req.params.id,
  childId: { $in: childIds }
})

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found"
      })
    }

    // ================= ACCESS CHECK =================
    // const access = await Access.findOne({
    //   userId,
    //   childId: alert.childId,
    //   accessStatus: "active"
    // })

    // if ( !access) {
    //   return res.status(403).json({
    //     message: "No permission for this child's alerts"
    //   })
    // }

    // ================= UPDATE =================
    alert.status = "ignored"

    await alert.save()

    return res.status(200).json({
      status: "success",
      message: "Alert ignored successfully",
      data: alert
    })

  } catch (error) {

    return res.status(500).json({
      message: error.message
    })

  }
}
exports.processSensorData = async (sensor, childId, incubatorId) => {

  const activeAlerts = await Alert.find({
    childId,
    status: "active"
  })

  const { alertsToCreate, alertsToResolve } =
    evaluateAlerts(sensor, activeAlerts)

  // CREATE
  for (const alert of alertsToCreate) {
    await Alert.create({
      ...alert,
      childId,
      incubatorId,
      sensorSnapshot: sensor
    })
  }

  // RESOLVE
  await Alert.updateMany(
    {
      childId,
      status: "active",
      alertType: { $in: alertsToResolve }
    },
    {
      status: "resolved",
      resolvedAt: new Date()
    }
  )
}