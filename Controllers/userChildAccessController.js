const Access = require('../Models/UserChildAccess')
const User = require('../Models/User')

// ================= CREATE ACCESS (Admin only)=================
exports.createAccess = async (req, res) => {
  try {

    const { userId, childId } = req.body

    // ================= VALIDATION =================
    if (!userId || !childId) {
      return res.status(400).json({
        status: "error",
        message: "userId and childId are required"
      })
    }

    // ================= ONLY ADMIN =================
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Only admin can assign children"
      })
    }

    // ================= CHECK USER =================
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      })
    }

    // ❌ IMPORTANT: only nurses can get children
    if (user.role !== "nurse") {
      return res.status(400).json({
        status: "error",
        message: "Only nurses can be assigned to children"
      })
    }

    // ================= CHECK DUPLICATE =================
    const existing = await Access.findOne({
      userId,
      childId,
      accessStatus: "active"
    })

    if (existing) {
      return res.status(400).json({
        status: "error",
        message: "Access already exists"
      })
    }

    // ================= CREATE ACCESS =================
    const access = await Access.create({
      userId,
      childId,
      accessStatus: "active"
    })

    return res.status(201).json({
      status: "success",
      message: "Child assigned to nurse successfully",
      data: access
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}

// ================= GET ALL ACCESS (Admin only)=================
exports.getAllAccess = async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not allowed"
      })
    }

    const access = await Access.find()
      .populate('userId', 'name email role')
      .populate('childId', 'childName status')

    return res.status(200).json({
      status: "success",
      results: access.length,
      data: access
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}


// ================= GET ACCESS BY USER(Nurse only) =================
exports.getAccessByUser = async (req, res) => {
  try {

    const userId = req.params.userId

    // ================= SELF OR ADMIN =================
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== userId
    ) {
      return res.status(403).json({
        status: "error",
        message: "Not allowed"
      })
    }

    const access = await Access.find({
      userId,
      accessStatus: "active"
    }).populate('childId')

    return res.status(200).json({
      status: "success",
      results: access.length,
      data: access
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}

// ================= GET ACCESS BY CHILD (Admin + Nurse only)=================
exports.getAccessByChild = async (req, res) => {
  try {

    const role = req.user.role

    if (!["admin", "nurse"].includes(role)) {
      return res.status(403).json({
        status: "error",
        message: "Not allowed"
      })
    }

    const access = await Access.find({
      childId: req.params.childId,
      accessStatus: "active"
    })
      .populate('userId', 'name role')
      .populate('childId', 'childName')

    return res.status(200).json({
      status: "success",
      results: access.length,
      data: access
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}


// ================= DEACTIVATE ACCESS Admin only =================
exports.deactivateAccess = async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Only admin can deactivate access"
      })
    }

    const access = await Access.findByIdAndUpdate(
      req.params.id,
      {
        accessStatus: "inactive",
        endDate: new Date()
      },
      { new: true }
    )

    if (!access) {
      return res.status(404).json({
        status: "error",
        message: "Access not found"
      })
    }

    return res.status(200).json({
      status: "success",
      message: "Access deactivated successfully",
      data: access
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}