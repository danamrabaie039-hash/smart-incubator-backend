const Alert = require('../Models/Alert')
const Access = require('../Models/UserChildAccess')
const Child = require('../Models/Child')


// ================= ROLE CHECK =================
const canManageAlerts = (role) => {
  return ['nurse', 'admin'].includes(role)
}


// ================= GET ACCESSIBLE CHILD IDS =================
const getAccessibleChildIds = async (user) => {

  const role = user.role?.toLowerCase()

  // ADMIN
  if (role === "admin") {
    const children = await Child.find().select("_id")
    return children.map(c => c._id)
  }

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

if (role !== "nurse" && role !== "admin") {
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

if (role !== "nurse" && role !== "admin") {
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
    if (role !== "nurse" && role !== "admin") {
  return res.status(403).json({
    message: "Alerts not allowed for this role"
  })
}

    const alert = await Alert.findById(req.params.id)

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found"
      })
    }

    // ================= ACCESS CHECK =================
    const access = await Access.findOne({
      userId,
      childId: alert.childId,
      accessStatus: "active"
    })

    if (!access && role !== "admin") {
      return res.status(403).json({
        message: "No permission for this child's alerts"
      })
    }

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
  if (role !== "nurse" && role !== "admin") {
  return res.status(403).json({
    message: "Alerts not allowed for this role"
  })
}

    const alert = await Alert.findById(req.params.id)

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found"
      })
    }

    // ================= ACCESS CHECK =================
    const access = await Access.findOne({
      userId,
      childId: alert.childId,
      accessStatus: "active"
    })

    if (!access && role !== "admin") {
      return res.status(403).json({
        message: "No permission for this child's alerts"
      })
    }

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