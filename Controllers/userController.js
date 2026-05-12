const userModule = require('../Models/User')
const bcryptJS = require('bcryptjs')
const jwt = require('jsonwebtoken')

// ================= USERNAME GENERATOR =================
function generateUsername(fullName) {
  const names = fullName.trim().split(' ')

  if (names.length < 3) {
    return fullName.toLowerCase().replace(/\s+/g, '.')
  }

  const firstLetter = names[0][0].toLowerCase()
  const middleLetter = names[1][0].toLowerCase()
  const lastName = names[names.length - 1].toLowerCase()

  return `${firstLetter}.${middleLetter}.${lastName}`
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
    let user = await userModule.findOne({ email: req.body.email })

    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" })
    }

    let passwordCheck = await user.comparePassword(req.body.password)

    if (!passwordCheck) {
      return res.status(401).json({ message: "Invalid Email or Password" })
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        role: user.role
      },
      'incubator_secret_key',
      { expiresIn: '1d' }
    )

    return res.status(200).json({
      message: "User Logged In Successfully",
      token,
      role: user.role,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        username: user.username,
        displayName: user.displayName,
        badge: user.badge
      }
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
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

    const { password, ...data } = saved._doc

    res.status(201).json({
      message: "Engineer created successfully",
      user: data
    })

  } catch (error) {
    res.status(400).json({ message: error.message })
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

    const { password, ...data } = saved._doc

    res.status(201).json({
      message: "Doctor created successfully",
      user: data
    })

  } catch (error) {
    res.status(400).json({ message: error.message })
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

    const { password, ...data } = saved._doc

    res.status(201).json({
      message: "Nurse created successfully",
      user: data
    })

  } catch (error) {
    res.status(400).json({ message: error.message })
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

    const { password, ...data } = saved._doc

    res.status(201).json({
      message: "Parent created successfully",
      user: data
    })

  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}