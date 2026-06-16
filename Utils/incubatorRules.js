function getIncubatorRules(birthWeek) {

  // 🟡 الخدّج جداً (أقل من 37 أسبوع)
  if (birthWeek === 35) {
    return {
      heaterAllowed: true,
      maxIncubatorTemp: 37,
      humidityTarget: 65
    }
  }

  // 🟢 أقرب للطبيعي (37 أسبوع)
  if (birthWeek === 37) {
    return {
      heaterAllowed: false,
      maxIncubatorTemp: 36.5,
      humidityTarget: 55
    }
  }

  // fallback (احتياط)
  return {
    heaterAllowed: true,
    maxIncubatorTemp: 37,
    humidityTarget: 60
  }
}

module.exports = {
  getIncubatorRules
}