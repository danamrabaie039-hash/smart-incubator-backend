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

    const identifier = req.body.identifier.trim().toLowerCase()

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

// ================= CREATE ENGINEER =================
exports.createEngineer = async function (req, res) {
  try {

    const hashedPassword = await bcryptJS.hash(req.body.password, 10)
    const username = generateUsername(req.body.name)

    let engineer = new userModule({
      name: req.body.name,
      username: username,
      displayName: getDisplayName("engineer", req.body.name),
      badge: getBadge("engineer"),
      email: req.body.email,
      password: hashedPassword,
      role: "engineer"
    })

    let saved = await engineer.save()

    const { password, ...user } = saved._doc

    res.status(201).json({
      status: "success",
      message: "Engineer created successfully",
      data: {
        user
      }
    })

  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message
    })
  }
}


// ================= CREATE DOCTOR =================
exports.createDoctor = async function (req, res) {
  try {

    const hashedPassword = await bcryptJS.hash(req.body.password, 10)
    const username = generateUsername(req.body.name)

    let doctor = new userModule({
      name: req.body.name,
      username: username,
      displayName: getDisplayName("doctor", req.body.name),
      badge: getBadge("doctor"),
      email: req.body.email,
      password: hashedPassword,
      role: "doctor"
    })

    let saved = await doctor.save()

    const { password, ...user } = saved._doc

    res.status(201).json({
      status: "success",
      message: "Doctor created successfully",
      data: {
        user
      }
    })

  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message
    })
  }
}


// ================= CREATE NURSE =================
exports.createNurse = async function (req, res) {
  try {

    const hashedPassword = await bcryptJS.hash(req.body.password, 10)
    const username = generateUsername(req.body.name)

    let nurse = new userModule({
      name: req.body.name,
      username: username,
      displayName: getDisplayName("nurse", req.body.name),
      badge: getBadge("nurse"),
      email: req.body.email,
      password: hashedPassword,
      role: "nurse"
    })

    let saved = await nurse.save()

    const { password, ...user } = saved._doc

    res.status(201).json({
      status: "success",
      message: "Nurse created successfully",
      data: {
        user
      }
    })

  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message
    })
  }
}


// ================= CREATE PARENT =================
exports.createParent = async function (req, res) {
  try {

    const hashedPassword = await bcryptJS.hash(req.body.password, 10)
    const username = generateUsername(req.body.name)

    let parent = new userModule({
      name: req.body.name,
      username: username,
      displayName: getDisplayName("parent", req.body.name),
      badge: getBadge("parent"),
      email: req.body.email,
      password: hashedPassword,
      role: "parent"
    })

    let saved = await parent.save()

    const { password, ...user } = saved._doc

    res.status(201).json({
      status: "success",
      message: "Parent created successfully",
      data: {
        user
      }
    })

  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message
    })
  }
}