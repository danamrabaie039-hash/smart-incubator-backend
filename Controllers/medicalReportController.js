const MedicalReport = require('../Models/MedicalReport')
const Child = require('../Models/Child')
const Access = require('../Models/UserChildAccess')


// ================= CREATE MEDICAL REPORT =================
exports.createMedicalReport = async (req, res) => {
  try {
    const role = req.user.role?.toLowerCase()

    // 👨‍⚕️ only doctor allowed
    if (role !== 'doctor') {
      return res.status(403).json({
        status: 'error',
        message: 'Only doctors can create medical reports'
      })
    }

    const {
      childId,
      temperatureStatus,
      oxygenStatus,
      heartStatus,
      diagnosis,
      recommendations,
      notes
    } = req.body

    const child = await Child.findById(childId)

    if (!child) {
      return res.status(404).json({
        status: 'error',
        message: 'Child not found'
      })
    }
if (!child.incubatorId) {
  return res.status(400).json({
    status: 'error',
    message: 'Child is not assigned to an incubator'
  })
}
    const report = await MedicalReport.create({
      childId,
      doctorId: req.user._id,

      temperatureStatus,
      oxygenStatus,
      heartStatus,

      diagnosis,
      recommendations,
      notes
    })

    return res.status(201).json({
      status: 'success',
      message: 'Medical report created successfully',
      data: report
    })

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}


// ================= GET ALL MEDICAL REPORTS =================
exports.getMedicalReports = async (req, res) => {
  try {
    const role = req.user.role?.toLowerCase()

    // 🚫 admin blocked
    if (role === 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admins are not allowed to access medical reports'
      })
    }

    let query = { isArchived: false }

    // 👩‍⚕️ nurse → only assigned children
    if (role === 'nurse') {
      const accessList = await Access.find({
        userId: req.user._id,
        accessStatus: 'active'
      })

      const childIds = accessList.map(a => a.childId)

      query.childId = { $in: childIds }
    }

    const reports = await MedicalReport.find(query)
      .populate('childId', 'childName')
      .populate('doctorId', 'name role')
      .sort({ createdAt: -1 })

    const formatted = reports.map(report => ({
      id: report._id,

      child: {
        id: report.childId?._id,
        name: report.childId?.childName
      },

      doctor: {
        id: report.doctorId?._id,
        name: report.doctorId?.name
      },

      temperatureStatus: report.temperatureStatus,
      oxygenStatus: report.oxygenStatus,
      heartStatus: report.heartStatus,

      diagnosis: report.diagnosis,
      recommendations: report.recommendations,
      notes: report.notes,

      createdAt: report.createdAt
    }))

    return res.json({
      status: 'success',
      count: formatted.length,
      data: formatted
    })

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}


// ================= GET REPORT BY ID =================
exports.getMedicalReportById = async (req, res) => {
  try {
      const role = req.user.role?.toLowerCase()

    const report = await MedicalReport.findById(req.params.id)
      .populate('childId', 'childName')
      .populate('doctorId', 'name role')

    if (!report) {
      return res.status(404).json({
        status: 'error',
        message: 'Medical report not found'
      })
    }

    if (role === 'admin') {
  return res.status(403).json({
    status: 'error',
    message: 'Admins are not allowed to access medical reports'
  })
}
if (role === 'nurse') {

  const access = await Access.findOne({
    userId: req.user._id,
    childId: report.childId._id,
    accessStatus: 'active'
  })

  if (!access) {
    return res.status(403).json({
      status: 'error',
      message: 'You do not have access to this child'
    })
  }
}
    return res.json({
      status: 'success',
      data: {
        child: {
          id: report.childId?._id,
          name: report.childId?.childName
        },

        doctor: {
          id: report.doctorId?._id,
          name: report.doctorId?.name
        },

        temperatureStatus: report.temperatureStatus,
        oxygenStatus: report.oxygenStatus,
        heartStatus: report.heartStatus,

        diagnosis: report.diagnosis,
        recommendations: report.recommendations,
        notes: report.notes,

        createdAt: report.createdAt
      }
    })

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}


// ================= UPDATE MEDICAL REPORT =================
exports.updateMedicalReport = async (req, res) => {
  try {
    const role = req.user.role?.toLowerCase()

    const report = await MedicalReport.findById(req.params.id)

    if (!report) {
      return res.status(404).json({
        status: 'error',
        message: 'Medical report not found'
      })
    }

    if (role === 'admin') {
  return res.status(403).json({
    status: 'error',
    message: 'Admins are not allowed to update medical reports'
  })
}

if (role !== 'doctor') {
  return res.status(403).json({
    status: 'error',
    message: 'Only doctors can update medical reports'
  })
}

if (report.doctorId.toString() !== req.user._id.toString()) {
  return res.status(403).json({
    status: 'error',
    message: 'You can only update your own reports'
  })
}

    const allowedFields = [
      'temperatureStatus',
      'oxygenStatus',
      'heartStatus',
      'diagnosis',
      'recommendations',
      'notes'
    ]

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        report[field] = req.body[field]
      }
    })

    await report.save()

    return res.json({
      status: 'success',
      message: 'Medical report updated successfully',
      data: report
    })

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}


// ================= ARCHIVE MEDICAL REPORT =================
exports.archiveMedicalReport = async (req, res) => {
  try {
    const role = req.user.role?.toLowerCase()


    const report = await MedicalReport.findById(req.params.id)

    if (!report) {
      return res.status(404).json({
        status: 'error',
        message: 'Medical report not found'
      })
    }

    if (role === 'admin') {
  return res.status(403).json({
    status: 'error',
    message: 'Admins are not allowed to archive medical reports'
  })
}

if (role !== 'doctor') {
  return res.status(403).json({
    status: 'error',
    message: 'Only doctors can archive medical reports'
  })
}

if (report.doctorId.toString() !== req.user._id.toString()) {
  return res.status(403).json({
    status: 'error',
    message: 'You can only archive your own reports'
  })
}

    report.isArchived = true
    await report.save()

    return res.json({
      status: 'success',
      message: 'Medical report archived successfully'
    })

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}