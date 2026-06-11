const Maintenance = require('../Models/Maintenance')

exports.getEngineerDashboard = async (req, res) => {
  try {

    const engineerId = req.user._id

    const total = await Maintenance.countDocuments({ engineerId, isArchived: false })

    const pending = await Maintenance.countDocuments({ engineerId, isArchived: false, status: 'pending' })
    const inProgress = await Maintenance.countDocuments({ engineerId, isArchived: false, status: 'in_progress' })
    const resolved = await Maintenance.countDocuments({ engineerId, isArchived: false, status: 'resolved' })

    const latest = await Maintenance.find({
      engineerId,
      isArchived: false
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('incubatorId', 'incubatorName')
      .populate('engineerId', 'name')

    const formattedLatest = latest.map(item => ({
      id: item._id,
      incubator: {
        id: item.incubatorId?._id,
        name: item.incubatorId?.incubatorName
      },
      engineer: {
        id: item.engineerId?._id,
        name: item.engineerId?.name
      },
      issueDescription: item.issueDescription,
      actionTaken: item.actionTaken,
      status: item.status,
      nextMaintenanceDate: item.nextMaintenanceDate,
      maintenanceDate: item.maintenanceDate
    }))

    return res.json({
      status: 'success',
      data: {
        summary: {
          total,
          pending,
          inProgress,
          resolved
        },
        latest: formattedLatest
      }
    })

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}