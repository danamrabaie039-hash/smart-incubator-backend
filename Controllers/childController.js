const childModule = require('../Models/Child')
const Incubator = require('../Models/Incubator')
const Access = require('../Models/UserChildAccess')


// ================= CREATE CHILD =================
exports.createChild = async function (req, res) {
  try {

    const nurseId = req.user._id

    if (req.user.role !== "nurse") {
      return res.status(403).json({
        status: "error",
        message: "Only nurses can create child"
      })
    }

    const {
      childName,
      fatherName,
      motherName,
      birthDate,
      birthWeek,
      gender,
      bloodType,
      birthWeight,
      currentWeight,
      medicalCondition
    } = req.body

    // ================= INCUBATOR =================
    const incubator = await Incubator.findOneAndUpdate(
      { status: "active", isOccupied: false },
      { isOccupied: true, lastUpdate: new Date() },
      { new: true }
    )

    if (!incubator) {
      return res.status(400).json({
        status: "error",
        message: "No available incubator"
      })
    }

    // ================= CHILD =================
    const child = await childModule.create({
      childName,
      fatherName,
      motherName,
      birthDate,
      birthWeek,
      gender,
      bloodType,
      birthWeight,
      currentWeight,
      medicalCondition,
      incubatorId: incubator._id
    })

    // ================= ACCESS (NURSE ONLY) =================
    await Access.create({
      userId: nurseId,
      childId: child._id,
      accessStatus: "active"
    })

    return res.status(201).json({
      status: "success",
      message: "Child created successfully",
      data: { child, incubator }
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}

// ================= GET ALL CHILDREN =================
exports.getAllChildren = async function (req, res) {
  try {

    const userId = req.user._id
    const role = req.user.role?.toLowerCase()

    let children = []



    // ================= DOCTOR (READ ONLY FULL) =================
  if (role === "doctor") {

      children = await childModule.find({
        status: { $ne: "discharged" }
      }).populate('incubatorId', 'incubatorName')
    }

    // ================= NURSE (ASSIGNED ONLY) =================
    else if (role === "nurse") {

      const accessList = await Access.find({
        userId,
        accessStatus: "active"
      })

      const childIds = accessList.map(a => a.childId)

      children = await childModule.find({
        _id: { $in: childIds },
        status: { $ne: "discharged" }
      }).populate('incubatorId', 'incubatorName')
    }

    else {
      return res.status(403).json({
        status: "error",
        message: "Not allowed"
      })
    }

    return res.status(200).json({
      status: "success",
      results: children.length,
      data: children
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}
// ================= GET CHILD BY ID =================
exports.getChildById = async function (req, res) {
  try {

    const role = req.user.role?.toLowerCase()

    if (![ "nurse", "doctor"].includes(role)) {
      return res.status(403).json({
        status: "error",
        message: "Not allowed"
      })
    }

    // ================= NURSE CHECK =================
    if (role === "nurse") {

      const access = await Access.findOne({
        userId: req.user._id,
        childId: req.params.id,
        accessStatus: "active"
      })

      if (!access) {
        return res.status(403).json({
          status: "error",
          message: "No access to this child"
        })
      }
    }

    const child = await childModule.findById(req.params.id)
      .populate('incubatorId', 'incubatorName')

    if (!child) {
      return res.status(404).json({
        status: "error",
        message: "Child not found"
      })
    }

    return res.status(200).json({
      status: "success",
      data: child
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}

// ================= UPDATE CHILD =================
exports.updateChild = async function (req, res) {
  try {

    const user = req.user
    const role = user.role?.toLowerCase()

    const child = await childModule.findById(req.params.id)

    if (!child) {
      return res.status(404).json({
        status: "error",
        message: "Child not found"
      })
    }

    if (child.status === "discharged") {
      return res.status(400).json({
        status: "error",
        message: "Cannot update discharged child"
      })
    }

    // ================= ROLE CONTROL =================
if (role !== "nurse") {
  return res.status(403).json({
    status: "error",
    message: "Only nurses can update child"
  })
}
// ================= ACCESS CHECK =================
const access = await Access.findOne({
  userId: req.user._id,
  childId: req.params.id,
  accessStatus: "active"
})

if (!access) {
  return res.status(403).json({
    status: "error",
    message: "No access to this child"
  })
}

    // ================= ALLOWED FIELDS =================

    const allowedFields = [
      "childName",
      "fatherName",
      "motherName",
      "birthWeight",
      "currentWeight",
      "medicalCondition",
      "bloodType"
    ]

    const updates = {}

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    })

    const updatedChild = await childModule.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )

    return res.status(200).json({
      status: "success",
      message: "Child updated successfully",
      data: updatedChild
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}

// ================= DELETE CHILD =================
exports.dischargeChild = async function (req, res) {
  try {

   const role = req.user.role?.toLowerCase()
   if (role !== "nurse") {
      return res.status(403).json({
        status: "error",
        message: "Not allowed"
      })
    }
const access = await Access.findOne({
  userId: req.user._id,
  childId: req.params.id,
  accessStatus: "active"
})

if (!access) {
  return res.status(403).json({
    status: "error",
    message: "No access to this child"
  })
}
    const child = await childModule.findByIdAndUpdate(
      req.params.id,
      { status: "discharged" },
      { new: true }
    )

    if (!child) {
      return res.status(404).json({
        status: "error",
        message: "Child not found"
      })
    }

    // ================= CLOSE ACCESS =================
    await Access.updateMany(
      { childId: child._id },
      {
        accessStatus: "inactive",
        endDate: new Date()
      }
    )

    // ================= FREE INCUBATOR =================
    if (child.incubatorId) {
      await Incubator.findByIdAndUpdate(child.incubatorId, {
        isOccupied: false,
        lastUpdate: new Date()
      })
    }

    return res.status(200).json({
      status: "success",
      message: "Child discharged successfully",
      data: child
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}