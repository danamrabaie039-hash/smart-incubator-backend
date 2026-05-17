const mongoose = require('mongoose')

const childSchema = new mongoose.Schema({

  childName: {
    type: String,
    required: true,
    trim: true
  },

  fatherName: {
    type: String,
    required: true
  },

  motherName: {
    type: String,
    required: true
  },

  birthWeek: {
    type: Number,
    default: null
  },

  birthWeight: {
    type: Number,
    default: null
  },

  currentWeight: {
    type: Number,
    default: null
  },

  medicalCondition: {
    type: String,
    default: ""
  },

  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    default: null
  },

  admissionDate: {
    type: Date,
    default: Date.now
  },

  // العلاقات
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  nurseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  engineerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  incubatorStatus: {
    type: String,
    enum: ['stable', 'warning', 'critical'],
    default: 'stable'
  }

}, { timestamps: true })

module.exports = mongoose.model('Child', childSchema)