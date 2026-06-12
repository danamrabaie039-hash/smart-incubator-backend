const Maintenance = require('../Models/Maintenance')
const Incubator = require('../Models/Incubator')


// ================= CREATE MAINTENANCE =================
exports.createMaintenance = async (req, res) => {
  try {

    const role = req.user.role?.toLowerCase()

    // 👷‍♂️ فقط المهندس
    if (role !== 'engineer') {
      return res.status(403).json({
        status: 'error',
        message: 'Only engineers can create maintenance records'
      })
    }

    const {
      incubatorId,
      issueDescription,
      actionTaken,
      nextMaintenanceDate
    } = req.body

    const incubator = await Incubator.findById(incubatorId)

    if (!incubator) {
      return res.status(404).json({
        status: 'error',
        message: 'Incubator not found'
      })
    }

    const maintenance = await Maintenance.create({
      incubatorId,
      engineerId: req.user._id,
      issueDescription,
      actionTaken,
      nextMaintenanceDate
    })

    return res.status(201).json({
      status: 'success',
      message: 'Maintenance record created successfully',
      data: maintenance
    })

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}
// ================= GET ALL MAINTENANCE=================
exports.getMaintenance = async (req, res) => {
  try {

    const role = req.user.role?.toLowerCase()

    let query = { isArchived: false }

    // 👷‍♂️ engineer → يشوف بس شغله
    if (role === 'engineer') {
      query.engineerId = req.user._id
    }

    // 👨‍⚕️ doctor / nurse → ممنوع
    if (role === 'doctor' || role === 'nurse') {
      return res.status(403).json({
        status: 'error',
        message: 'Not allowed to view maintenance records'
      })
    }

    if (role === 'admin') {
  return res.status(403).json({
    status: 'error',
    message: 'Admins are not allowed to access maintenance records'
  })
}
    const data = await Maintenance.find(query)
      .populate('incubatorId', 'incubatorName')
      .populate('engineerId', 'name role')
      .sort({ createdAt: -1 })

    const formatted = data.map(m => ({
      id: m._id,

      incubator: {
        id: m.incubatorId?._id,
        name: m.incubatorId?.incubatorName
      },

      engineer: {
        id: m.engineerId?._id,
        name: m.engineerId?.name
      },

      issueDescription: m.issueDescription,
      actionTaken: m.actionTaken,
      status: m.status,
      maintenanceDate: m.maintenanceDate,
      nextMaintenanceDate: m.nextMaintenanceDate
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

// ================= GET MAINTENANCE BY ID =================
exports.getMaintenanceById = async (req, res) => {
  try {

    const role = req.user.role?.toLowerCase()

    const maintenance = await Maintenance.findById(req.params.id)
      .populate('incubatorId', 'incubatorName')
      .populate('engineerId', 'name role')

    if (!maintenance) {
      return res.status(404).json({
        status: 'error',
        message: 'Maintenance not found'
      })
    }

    if (
      role !== 'engineer' ||
      maintenance.engineerId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Not allowed to view this record'
      })
    }

    return res.status(200).json({
      status: 'success',
      data: maintenance
    })

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}
// ================= UPDATE MAINTENANCE =================
exports.updateMaintenance = async (req, res) => {
  try {

    const role = req.user.role?.toLowerCase()

    const maintenance = await Maintenance.findById(req.params.id)

    if (!maintenance) {
      return res.status(404).json({
        status: 'error',
        message: 'Maintenance not found'
      })
    }

    // 👷‍♂️ فقط المهندس صاحب السجل
    if (role !== 'engineer' || maintenance.engineerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not allowed to update this record'
      })
    }

    const allowedFields = [
      'issueDescription',
      'actionTaken',
      'status',
      'nextMaintenanceDate'
    ]

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        maintenance[field] = req.body[field]
      }
    })

    await maintenance.save()

    return res.json({
      status: 'success',
      message: 'Maintenance updated successfully',
      data: maintenance
    })

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}
// ================= ARCHIVE MAINTENANCE =================
exports.archiveMaintenance = async (req, res) => {
  try {

    const role = req.user.role?.toLowerCase()

    const maintenance = await Maintenance.findById(req.params.id)

    if (!maintenance) {
      return res.status(404).json({
        status: 'error',
        message: 'Maintenance not found'
      })
    }

    if (role !== 'engineer' || maintenance.engineerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not allowed to archive this record'
      })
    }

    maintenance.isArchived = true
    await maintenance.save()

    return res.json({
      status: 'success',
      message: 'Maintenance archived successfully'
    })

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}
