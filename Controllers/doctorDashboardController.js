const Child = require('../Models/Child')
const MedicalReport = require('../Models/MedicalReport')
const Access = require('../Models/UserChildAccess')
const { getAccessibleChildIds } = require('../Utils/alertAccessFilter')


// ================= DOCTOR DASHBOARD =================
exports.getDoctorDashboard = async (req, res) => {
  try {

    const role = req.user.role?.toLowerCase()


    // ================= GET ACCESSIBLE CHILDREN =================
    const childIds = await getAccessibleChildIds(req.user)

    if (!childIds.length) {
      return res.status(200).json({
        status: "success",
        data: {
          summary: {
            totalChildren: 0,
            totalReports: 0
          },
          children: [],
          latestReports: []
        }
      })
    }

    // ================= CHILDREN =================
      const children = await Child.find({
      _id: { $in: childIds }
    })
    .select('childName incubatorId')
    .populate('incubatorId', 'incubatorName')

    // ================= REPORTS =================
    const reports = await MedicalReport.find({
      childId: { $in: childIds },
      isArchived: false
    })
      .populate('childId', 'childName')
      .populate('doctorId', 'name')
      .sort({ createdAt: -1 })
      .limit(10)

    // ================= SUMMARY =================
    const totalReports = await MedicalReport.countDocuments({
      childId: { $in: childIds },
      isArchived: false
    })

    return res.status(200).json({
      status: "success",
      data: {
        summary: {
          totalChildren: children.length,
          totalReports
        },
        children,
        latestReports: reports.map(r => ({
        id: r._id,
        child: r.childId?.childName,
        doctor: r.doctorId?.name,
        diagnosis: r.diagnosis,
        createdAt: r.createdAt
}))
      }
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}