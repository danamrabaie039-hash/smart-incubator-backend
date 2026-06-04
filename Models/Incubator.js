const mongoose = require('mongoose')

const incubatorSchema = new mongoose.Schema({

  incubatorName: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  isOccupied: {
  type: Boolean,
  default: false
  },
  connectionStatus: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  },

  cameraUrl: {
    type: String,
    default: null
  },

 
  lastUpdate: {
    type: Date,
    default: Date.now
  },

  lastMaintenanceDate: {
    type: Date,
    default: null
  },
  apiKey: {
  type: String,
  unique: true,
   sparse: true,
  // required: null
 }

}, {
  timestamps: true
})

module.exports = mongoose.model('Incubator', incubatorSchema)