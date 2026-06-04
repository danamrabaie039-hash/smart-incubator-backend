const mongoose = require('mongoose')

const childSchema = new mongoose.Schema({

  childName: {
    type: String,
    required: true
  },

  fatherName: {
    type: String,
    required: true
  },

  motherName: {
    type: String,
    required: true
  },

  birthDate: {
    type: Date,
    required: true
  },

  birthWeek: {
    type: Number,
    required: true
  },

  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },

  bloodType: {
    type: String,
    required: true
  },

  birthWeight: {
    type: Number,
    required: true
  },

  currentWeight: {
    type: Number,
    required: true
  },

  medicalCondition: {
    type: String,
    default: ""
  },

  admissionDate: {
    type: Date,
    default: Date.now
  },

status: {
  type: String,
  enum: ['active', 'discharged'],
  default: 'active'
},

  incubatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incubator',
    default: null
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Child', childSchema)