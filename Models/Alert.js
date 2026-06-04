const mongoose = require('mongoose')

const alertSchema = new mongoose.Schema({

  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },

  incubatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incubator',
    required: true
  },



  alertType: {
    type: String,
    enum: [
      'high_temperature',
      'low_oxygen',
      'high_heart_rate',
      'high_humidity',
      'sound_detected'
    ],
    required: true
  },

  alertLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },

  message: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ['active', 'resolved', 'ignored'],
    default: 'active'
  },
    



  // 🔥 إضافة مهمة جداً للمستقبل
  sensorSnapshot: {
    temperature: Number,
    oxygenSaturation: Number,
    heartRate: Number,
    humidity: Number,
    soundLevel: Number
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Alert', alertSchema)