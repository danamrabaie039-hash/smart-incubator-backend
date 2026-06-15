const Child = require('../Models/Child')
const UserChildAccess = require('../Models/UserChildAccess')





/**
 * هل المستخدم يقدر يشوف تنبيهات؟
 * (Option A: nurse only)
 */
const canViewAlert = (user) => {
  const role = user.role?.toLowerCase()

  return role === "nurse"
}

/**
 * يرجع الأطفال المسموح للمستخدم يشوف تنبيهاتهم
 */
const getAccessibleChildIds = async (user) => {

  const role = user.role?.toLowerCase()

  // 🔥 ADMIN / DOCTOR / ENGINEER = لا alerts نهائياً
  if (role !== "nurse") {
    return []
  }

  // 👩‍⚕️ NURSE فقط
  const accessList = await UserChildAccess.find({
    userId: user._id,
    accessStatus: "active"
  }).select("childId")

  return accessList.map(a => a.childId.toString())
}

module.exports = {
  canViewAlert,
  getAccessibleChildIds
}