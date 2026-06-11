const mongoose = require('mongoose')

const medicalReportSchema = new mongoose.Schema({

  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },



  temperatureStatus: {
    type: String,
    enum: ['stable', 'high', 'low'],
    required: true
  },

  oxygenStatus: {
    type: String,
    enum: ['good', 'warning', 'critical'],
    required: true
  },

  heartStatus: {
    type: String,
    enum: ['normal', 'abnormal'],
    required: true
  },

  diagnosis: {
    type: String,
    required: true
  },

  recommendations: {
    type: String,
    default: ''
  },

  notes: {
    type: String,
    default: ''
  },

  isArchived: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('MedicalReport', medicalReportSchema)