const Sensor = require('../Models/Sensor')
const Incubator = require('../Models/Incubator')
const Child = require('../Models/Child')
const Alert = require('../Models/Alert')
const Access = require('../Models/UserChildAccess')
const { getAccessibleChildIds } = require('../Utils/alertAccessFilter')

// ================= LATEST SENSOR =================
exports.getLatestSensorByIncubator = async (req, res) => {

  try {

    const { incubatorId } = req.params

    // 1. check incubator
    const incubator = await Incubator.findById(incubatorId)

    if (!incubator) {
      return res.status(404).json({
        status: "error",
        message: "Incubator not found"
      })
    }

    // 2. get latest sensor reading
    const sensor = await Sensor.findOne({ incubatorId })
      .sort({ createdAt: -1 })

    if (!sensor) {
      return res.status(404).json({
        status: "error",
        message: "No sensor data found"
      })
    }

    // 3. get child
    const child = await Child.findOne({ incubatorId })

    return res.status(200).json({
      status: "success",
      data: {
        sensor,
        incubator: {
          id: incubator._id,
          name: incubator.incubatorName,
          status: incubator.status,
          connectionStatus: incubator.connectionStatus
        },
        child: child ? {
          id: child._id,
          name: child.childName
        } : null
      }
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}
//==================getDashboardSummary==============
exports.getDashboardSummary = async (req, res) => {

  try {
  const role = req.user.role?.toLowerCase()

   if (!["admin", "nurse", "doctor"].includes(role)) {
  return res.status(403).json({
    status: "error",
    message: "Access denied"
  })
}
  const childIds = await getAccessibleChildIds(req.user)


    // ================= CHILDREN =================
    const totalChildren = await Child.countDocuments({
         _id: { $in: childIds }
    })

    // ================= INCUBATORS =================
    const totalIncubators = await Incubator.countDocuments()

    const occupiedIncubators = await Incubator.countDocuments({
      isOccupied: true
    })

    const maintenanceIncubators = await Incubator.countDocuments({
      status: "maintenance"
    })

    // ================= ALERTS =================
    const activeAlerts = await Alert.countDocuments({
      status: "active",
      childId: { $in: childIds }
      
    })

    const resolvedAlerts = await Alert.countDocuments({
      status: "resolved",
      childId: { $in: childIds }
    })

    // ================= RESPONSE =================
    return res.status(200).json({
      status: "success",
      data: {
        children: {
          total: totalChildren
        },
        incubators: {
          total: totalIncubators,
          occupied: occupiedIncubators,
          maintenance: maintenanceIncubators
        },
        alerts: {
          active: activeAlerts,
          resolved: resolvedAlerts
        }
      }
    })

  } catch (error) {

    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}


//===================getRoleDashboard=================
exports.getRoleDashboard = async (req, res) => {

  try {

    const role = req.user.role?.toLowerCase()
      // ================= ROLE GUARD =================
    if (!role || !["admin", "nurse", "doctor"].includes(role)) {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized role"
      })
    }

    

    // ================= ADMIN =================
    if (role === "admin") {

      const totalChildren = await Child.countDocuments({
        status: { $ne: "discharged" }
      })

      const activeAlerts = await Alert.countDocuments({
        status: "active"
      })

      return res.status(200).json({
        status: "success",
        role: "admin",
        data: {
          totalChildren,
          activeAlerts
        }
      })
    }

    // ================= GET ACCESS IDS (FIXED) =================
    const childIds = await getAccessibleChildIds(req.user)
    

    

    if (!childIds || childIds.length === 0) {
      return res.status(200).json({
        status: "success",
        role,
        data: {
          alerts: []
        }
      })
    }

    // ================= NURSE =================
    if (role === "nurse") {

      const alerts = await Alert.find({
        childId: { $in: childIds },
        status: "active",
        alertLevel: { $in: ["low", "medium", "high"] }
      })
      .populate("childId", "childName")
      .populate("incubatorId", "incubatorName")
      .sort({ createdAt: -1 })

      return res.status(200).json({
        status: "success",
        role: "nurse",
        data: { alerts }
      })
    }

    // ================= DOCTOR =================
if (role === "doctor") {

  const childIds = await getAccessibleChildIds(req.user)

  const children = await Child.find({
    _id: { $in: childIds }
  }).populate("incubatorId", "incubatorName")

  return res.status(200).json({
    status: "success",
    role: "doctor",
    data: {
      children
    }
  })
}
   // ================= FALLBACK =================
    return res.status(403).json({
      status: "error",
      message: "Unauthorized role"
    })


  } catch (error) {

    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}