const HourlyReport = require('../Models/HourlyReport')
const Child = require('../Models/Child')
const Access = require('../Models/UserChildAccess')


const isAdmin = (role) => role === 'admin'
// ================= CREATE HOURLY REPORT (NURSE ONLY) =================
exports.createHourlyReport = async (req, res) => {
  try {
       
    const role = req.user.role?.toLowerCase()


    if (role !== 'nurse') {
      return res.status(403).json({
        status: 'error',
        message: 'Only nurses can create hourly reports'
      })
    }

    const {
      childId,
      babyTemperature,
      oxygenSaturation,
      heartRate,
      weight,
      actionsTaken,
      recommendations,
      notes
    } = req.body

    // 🔐 ACCESS CHECK (FIRST)
    const access = await Access.findOne({
      userId: req.user._id,
      childId,
      accessStatus: 'active'
    })

    if (!access) {
      return res.status(403).json({
        status: 'error',
        message: 'No access to this child'
      })
    }

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

    const report = await HourlyReport.create({
      childId,
      incubatorId: child.incubatorId,
      nurseId: req.user._id,
      babyTemperature,
      oxygenSaturation,
      heartRate,
      weight,
      actionsTaken,
      recommendations,
      notes
    })

  const fullReport = await HourlyReport.findById(report._id)
 
 
  
    return res.status(201).json({
      status: 'success',
      message: 'Hourly report created successfully',
      data: report
    })

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}
// ================= GET ALL REPORTS =================
exports.getHourlyReports = async (req, res) => {
  try {
    const role = req.user.role?.toLowerCase()

    if (isAdmin(role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Admins are not allowed to access hourly reports'
      })
    }

    let query = { isArchived: false }

    if (role === 'nurse') {
      const accessList = await Access.find({
        userId: req.user._id,
        accessStatus: 'active'
      })

      const childIds = accessList.map(a => a.childId)

      query.childId = { $in: childIds }
    }

    const reports = await HourlyReport.find(query)
      .populate('childId', 'childName')
      .populate('incubatorId', 'incubatorName')
      .populate('nurseId', 'name role')
      .sort({ createdAt: -1 })

    return res.json({
      status: 'success',
      count: reports.length,
      data: reports
    })

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}
// ================= GET REPORT BY ID =================
exports.getHourlyReportById = async (req, res) => {
  try {
    const role = req.user.role?.toLowerCase()

    if (isAdmin(role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Admins are not allowed to access hourly reports'
      })
    }

    const report = await HourlyReport.findById(req.params.id)
      .populate('childId', 'childName')
      .populate('incubatorId', 'incubatorName')
      // .populate('nurseId', 'name role')

    if (!report) {
      return res.status(404).json({
        status: 'error',
        message: 'Report not found'
      })
    }

    if (role === 'nurse') {
      const access = await Access.findOne({
        userId: req.user._id,
        childId: report.childId,
        accessStatus: 'active'
      })

      if (!access) {
        return res.status(403).json({
          status: 'error',
          message: 'No access to this child'
        })
      }
    }

    return res.json({
      status: 'success',
      data: report
    })

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

// ================= UPDATE REPORT =================
exports.updateHourlyReport = async (req, res) => {
  try {

    const role = req.user.role?.toLowerCase()

    if (isAdmin(role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Admins are not allowed to update reports'
      })
    }

    if (role === 'doctor') {
      return res.status(403).json({
        status: 'error',
        message: 'Doctors are read-only'
      })
    }

    const report = await HourlyReport.findById(req.params.id)

    if (!report) {
      return res.status(404).json({
        status: 'error',
        message: 'Hourly report not found'
      })
    }

    // 🔐 ACCESS CHECK (IMPORTANT)
    const access = await Access.findOne({
      userId: req.user._id,
      childId: report.childId,
      accessStatus: 'active'
    })

    if (!access) {
      return res.status(403).json({
        status: 'error',
        message: 'No access to this report child'
      })
    }

    if (role === 'nurse' && report.nurseId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only update your own reports'
      })
    }

    const allowedFields = [
      'babyTemperature',
      'oxygenSaturation',
      'heartRate',
      'weight',
      'actionsTaken',
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
      message: 'Hourly report updated successfully',
      data: report
    })

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}


// ================= ARCHIVE REPORT =================
exports.archiveHourlyReport = async (req, res) => {
  try {

    const role = req.user.role?.toLowerCase()

    if (isAdmin(role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Admins are not allowed to archive reports'
      })
    }

    if (role === 'doctor') {
      return res.status(403).json({
        status: 'error',
        message: 'Doctors cannot archive reports'
      })
    }

    const report = await HourlyReport.findById(req.params.id)

    if (!report) {
      return res.status(404).json({
        status: 'error',
        message: 'Hourly report not found'
      })
    }

    const access = await Access.findOne({
      userId: req.user._id,
      childId: report.childId,
      accessStatus: 'active'
    })

    if (!access) {
      return res.status(403).json({
        status: 'error',
        message: 'No access to this report child'
      })
    }

    if (role === 'nurse' && report.nurseId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only archive your own reports'
      })
    }

    report.isArchived = true
    await report.save()

    return res.json({
      status: 'success',
      message: 'Hourly report archived successfully'
    })

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}