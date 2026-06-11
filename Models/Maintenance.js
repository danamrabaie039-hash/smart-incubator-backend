const mongoose = require('mongoose')

const maintenanceSchema = new mongoose.Schema({

  incubatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incubator',
    required: true
  },

  engineerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  issueDescription: {
    type: String,
    required: true
  },

  actionTaken: {
    type: String,
    default: ''
  },

  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved'],
    default: 'pending'
  },

  maintenanceDate: {
    type: Date,
    default: Date.now
  },

  nextMaintenanceDate: {
    type: Date,
    default: null
  },

  isArchived: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Maintenance', maintenanceSchema)