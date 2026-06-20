const userModule = require('../Models/User')
const bcryptJS = require('bcryptjs')
const jwt = require('jsonwebtoken')

// ================= HELPERS =================

// USERNAME GENERATOR
function generateUsername(fullName) {
  const names = fullName
    .trim()
    .toLowerCase()
    .split(' ')
    .filter(n => n.length > 0)

  if (names.length < 2) {
    return names[0]
  }

  const firstInitial = names[0][0]
  const secondInitial = names[1][0]
  const lastName = names[names.length - 1]

  const randomNumber = Math.floor(1000 + Math.random() * 9000)

  return `${firstInitial}.${secondInitial}.${lastName}.${randomNumber}`
}

// BADGE
function getBadge(role) {
  if (role === "doctor") return "DR"
  if (role === "nurse") return "NUR"
  if (role === "engineer") return "ENG"
  if (role === "admin") return "ADM"
  return ""
}

// DISPLAY NAME
function getDisplayName(role, name) {
  if (role === "doctor") return `Dr. ${name}`
  if (role === "nurse") return `Nurse ${name}`
  if (role === "engineer") return `Eng. ${name}`
  if (role === "admin") return `Admin ${name}`
  return name
}

// PASSWORD GENERATOR
function generatePassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$"
  let password = ""

  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return password
}

// ================= AUTH =================

// LOGIN
exports.login = async function (req, res) {
  try {

    const identifier = (req.body.identifier || "").trim().toLowerCase()

    let user = await userModule.findOne({
      $or: [
        { email: identifier },
        { username: identifier }
      ]
    })

    if (!user) {
    return res.status(401).json({
    status: "error",
    message: "Invalid Email or Password"
  })
}

    if (!user.isActive) {
      return res.status(403).json({
        status: "error",
        message: "User account is inactive"
      })
    }

    let passwordCheck = await user.comparePassword(req.body.password)

    if (!passwordCheck) {
      return res.status(401).json({
        status: "error",
        message: "Invalid Email or Password"
      })
    }

    const normalizedRole = user.role.toLowerCase()

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        role: normalizedRole
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: normalizedRole,
          username: user.username,
          displayName: user.displayName,
          badge: user.badge
        },
        token: token
      }
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}

// ================= USER MANAGEMENT =================

// CREATE USER (ADMIN ONLY)
exports.createUser = async function (req, res) {
  try {

    const name = req.body.name.trim()
    const email = req.body.email.trim().toLowerCase()
    const phone = req.body.phone?.trim()
    const role = req.body.role?.trim().toLowerCase()

    const allowedRoles = ["admin", "doctor", "nurse", "engineer"]

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role"
      })
    }

    const generatedPassword = generatePassword()
    const hashedPassword = await bcryptJS.hash(generatedPassword, 10)

    const username = generateUsername(name)

    let user = new userModule({
      name,
      email,
      phone,
      username,
      displayName: getDisplayName(role, name),
      badge: getBadge(role),
      password: hashedPassword,
      role
    })

    let saved = await user.save()

    const { password, ...userData } = saved._doc

    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        user: userData,
        generatedPassword
      }
    })

  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message
    })
  }
}

// ================= GET ALL USERS =================

exports.getAllUsers = async function (req, res) {

  try {

    const users = await userModule.find({
      isActive: true
    })

    return res.status(200).json({
      status: "success",
      results: users.length,
      data: users
    })

  } catch (error) {

    return res.status(500).json({
      status: "error",
      message: error.message
    })

  }

}
// ================= GET USER BY ID =================

exports.getUserById = async function (req, res) {

  try {

    const user = await userModule.findOne({
      _id: req.params.id,
      isActive: true
    })

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      })
    }

    return res.status(200).json({
      status: "success",
      data: user
    })

  } catch (error) {

    return res.status(500).json({
      status: "error",
      message: error.message
    })

  }

}
// ================= DEACTIVATE USER =================

exports.deactivateUser = async function (req, res) {

  try {

    const user = await userModule.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false
      },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      })
    }

    return res.status(200).json({
      status: "success",
      message: "User deactivated successfully"
    })

  } catch (error) {

    return res.status(500).json({
      status: "error",
      message: error.message
    })

  }

}
// ================= UPDATE USER =================

exports.updateUser = async function (req, res) {

  try {

    const userId = req.params.id


    const user = await userModule.findById(userId)

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      })
    }


    const updates = {}

    if (req.body.phone) {
      updates.phone = req.body.phone.trim()
    }

    if (req.body.specialty) {
      updates.specialty = req.body.specialty.trim()
    }

    // if (req.body.displayName) {
    //   updates.displayName = req.body.displayName.trim()
    // }


    // ================= NAME =================
    if (req.body.name && req.body.name !== user.name) {
      const name = req.body.name.trim()

      updates.name = name

      // توليد displayName تلقائي
      updates.displayName = getDisplayName(user.role, name)
    }

     // ================= EMAIL =================
    if (req.body.email && req.body.email !== user.email) {

      const email = req.body.email.trim().toLowerCase()

      const existingUser = await userModule.findOne({
        email,
        _id: { $ne: userId }
      })

      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "Email already exists"
        })
      }
       updates.email = email
    }
    const updatedUser = await userModule.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      })
    }

    return res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: updatedUser
    })

  } catch (error) {

    return res.status(500).json({
      status: "error",
      message: error.message
    })

  }

}


// ================= PASSWORD =================

// CHANGE PASSWORD
exports.changePassword = async function (req, res) {
  try {

    const userId = req.user._id
    const { currentPassword, newPassword } = req.body


    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 8 characters"
      })
    }
    if (currentPassword === newPassword) {
  return res.status(400).json({
    status: "error",
    message: "New password must be different from current password"
  })
}
    const user = await userModule.findById(userId).select("+password")

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    const isMatch = await bcryptJS.compare(currentPassword, user.password)

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect"
      })
    }

    const hashedPassword = await bcryptJS.hash(newPassword, 10)

    user.password = hashedPassword
    await user.save()

    return res.status(200).json({
      status: "success",
      message: "Password changed successfully"
    })

  } catch (error) {

    return res.status(500).json({
      status: "error",
      message: error.message
    })

  }
}
