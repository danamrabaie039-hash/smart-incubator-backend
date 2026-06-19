const Child = require('../Models/Child')
const Access = require('../Models/UserChildAccess')
const HourlyReport = require('../Models/HourlyReport')
const MedicalReport = require('../Models/MedicalReport')
const Alert = require('../Models/Alert')

exports.getChildHistory = async (req, res) => {
  try {

    const childId = req.params.id

    // 1. Child
    const child = await Child.findById(childId)
    if (!child) {
      return res.status(404).json({
        status: "error",
        message: "Child not found"
      })
    }

    // 2. Access check
    const access = await Access.findOne({
      childId,
      userId: req.user._id
    })

    if (!access) {
      return res.status(403).json({
        status: "error",
        message: "No access"
      })
    }

// 🟢 Hourly Active
const hourlyReports = await HourlyReport.find({
  childId,
  isArchived: false
})
.populate("nurseId", "name role")
.sort({ createdAt: -1 })

// 🟡 Hourly Archived
const archivedHourlyReports = await HourlyReport.find({
  childId,
  isArchived: true
})
.populate("nurseId", "name role")
.sort({ createdAt: -1 })

// 🔵 Medical Active
const medicalReports = await MedicalReport.find({
  childId,
  isArchived: false
})
.populate("doctorId", "name role")
.sort({ createdAt: -1 })

// 🔴 Medical Archived
const archivedMedicalReports = await MedicalReport.find({
  childId,
  isArchived: true
})
.populate("doctorId", "name role")
.sort({ createdAt: -1 })
      const nurse = hourlyReports[0]?.nurseId || null
const doctor = medicalReports[0]?.doctorId || null

const cleanHourlyReports = hourlyReports.map(r => ({
  id: r._id,
  babyTemperature: r.babyTemperature,
  oxygenSaturation: r.oxygenSaturation,
  heartRate: r.heartRate,
  weight: r.weight,
  actionsTaken: r.actionsTaken,
  recommendations: r.recommendations,
  notes: r.notes,
  isArchived: r.isArchived,
  createdAt: r.createdAt
}))
const cleanMedicalReports = medicalReports.map(r => ({
  id: r._id,
  temperatureStatus: r.temperatureStatus,
  oxygenStatus: r.oxygenStatus,
  heartStatus: r.heartStatus,
  diagnosis: r.diagnosis,
  recommendations: r.recommendations,
  notes: r.notes,
  isArchived: r.isArchived,
  createdAt: r.createdAt
}))




      const stats = {
  hourlyReportsCount: hourlyReports.length,
  archivedHourlyReportsCount: archivedHourlyReports.length,
  medicalReportsCount: medicalReports.length,
    archivedMedicalReportsCount: archivedMedicalReports.length
}

    // 4. RESPONSE (reports only)
    return res.json({
      status: "success",
      data: {
child: {
  id: child._id,
  childName: child.childName,
  fatherName: child.fatherName,
  motherName: child.motherName,
  gender: child.gender,
  birthDate: child.birthDate,
  birthWeek: child.birthWeek,
  bloodType: child.bloodType,
  birthWeight: child.birthWeight,
  currentWeight: child.currentWeight,
  medicalCondition: child.medicalCondition,
  status: child.status,
  admissionDate: child.admissionDate
},
        stats,
        nurse,             // 👈 مرة وحدة
        doctor,         // 👈 مرة وحدة
   
     active: {
      hourlyReports: cleanHourlyReports,
      medicalReports: cleanMedicalReports
    },
 archived: {
      hourlyReports: archivedHourlyReports,
      medicalReports: archivedMedicalReports
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