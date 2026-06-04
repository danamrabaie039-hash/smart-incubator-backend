const Child = require('../Models/Child')
const UserChildAccess = require('../Models/UserChildAccess')

/**
 * هل المستخدم يقدر يشوف طفل معين؟
 */
const canViewAlert = async (user, childId) => {

  const role = user.role?.toLowerCase()

  // 🔥 ADMIN
  if (role === "admin") return true

  // ❌ DOCTOR ممنوع نهائياً من alerts
  if (role === "doctor") return false

  // 👩‍⚕️ NURSE فقط
  if (role === "nurse") {
    const access = await UserChildAccess.findOne({
      userId: user._id,
      childId,
      accessStatus: "active"
    })

    return !!access
  }

  return false
}

/**
 * يرجع كل الأطفال المسموح للمستخدم يشوفهم
 */
const getAccessibleChildIds = async (user) => {

  const role = user.role?.toLowerCase()

  // 🔥 ADMIN
  if (role === "admin") {
    const all = await Child.find().select('_id')
    return all.map(c => c._id)
  }

  // 👨‍⚕️ DOCTOR
if (role === "doctor") {
  // doctor does NOT have access to alerts system
  return []
}
  // 👩‍⚕️ NURSE فقط عنده access
  const accessList = await UserChildAccess.find({
    userId: user._id,
    accessStatus: "active"
  })
return accessList.map(a => a.childId.toString())
}

module.exports = {
  canViewAlert,
  getAccessibleChildIds
}