const userModule = require('../Models/User')
const bcryptJS = require('bcryptjs')
const jwt = require('jsonwebtoken')

// ================= USERNAME GENERATOR =================
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

  return `${firstInitial}.${secondInitial}.${lastName}`
}

// ================= BADGE =================
function getBadge(role) {
  if (role === "doctor") return "DR"
  if (role === "nurse") return "NUR"
  if (role === "engineer") return "ENG"
  if (role === "admin") return "ADM"
  return "PARENT"
}

// ================= DISPLAY NAME =================
function getDisplayName(role, name) {
  if (role === "doctor") return `Dr. ${name}`
  if (role === "nurse") return `Nurse ${name}`
  if (role === "engineer") return `Eng. ${name}`
  return name
}

// ================= LOGIN =================
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

// ================= CREATE USER (ADMIN ONLY) =================
exports.createUser = async function (req, res) {
  try {

    const { name, email, password, phone, role } = req.body

    const hashedPassword = await bcryptJS.hash(password, 10)
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

    const { password: _, ...userData } = saved._doc

    res.status(201).json({
      status: "success",
      message: `${role} created successfully`,
      data: {
        user: userData
      }
    })

  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message
    })
  }
}