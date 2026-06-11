// const Sensor = require('../Models/Sensor')
// const Incubator = require('../Models/Incubator')
// const Child = require('../Models/Child')
// const Alert = require('../Models/Alert')
// const Access = require('../Models/UserChildAccess')
// const { getAccessibleChildIds } = require('../Utils/alertAccessFilter')

// //==================getDashboardSummary==============
// exports.getDashboardSummary = async (req, res) => {

//   try {
//   const role = req.user.role?.toLowerCase()

//    if (!["admin", "nurse", "doctor"].includes(role)) {
//   return res.status(403).json({
//     status: "error",
//     message: "Access denied"
//   })
// }
//   const childIds = await getAccessibleChildIds(req.user)


//     // ================= CHILDREN =================
//     const totalChildren = await Child.countDocuments({
//          _id: { $in: childIds }
//     })

//     // ================= INCUBATORS =================
//     const totalIncubators = await Incubator.countDocuments()

//     const occupiedIncubators = await Incubator.countDocuments({
//       isOccupied: true
//     })

//     const maintenanceIncubators = await Incubator.countDocuments({
//       status: "maintenance"
//     })

//     // ================= ALERTS =================
//     const activeAlerts = await Alert.countDocuments({
//       status: "active",
//       childId: { $in: childIds }
      
//     })

//     const resolvedAlerts = await Alert.countDocuments({
//       status: "resolved",
//       childId: { $in: childIds }
//     })

//     // ================= RESPONSE =================
//     return res.status(200).json({
//       status: "success",
//       data: {
//         children: {
//           total: totalChildren
//         },
//         incubators: {
//           total: totalIncubators,
//           occupied: occupiedIncubators,
//           maintenance: maintenanceIncubators
//         },
//         alerts: {
//           active: activeAlerts,
//           resolved: resolvedAlerts
//         }
//       }
//     })

//   } catch (error) {

//     return res.status(500).json({
//       status: "error",
//       message: error.message
//     })
//   }
// }

