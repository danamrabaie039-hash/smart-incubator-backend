const mongoose = require('mongoose')

const childSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  age: {
    type: Number,
    default: null
  },

  gender: {
    type: String,
    enum: ['male', 'female'],
    default: null
  },

  // ================= RELATIONS =================

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

  engineerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // ================= INCUBATOR STATUS =================

  incubatorStatus: {
    type: String,
    enum: ['stable', 'warning', 'critical'],
    default: 'stable'
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Child', childSchema)