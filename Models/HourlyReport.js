const mongoose = require('mongoose')

const hourlyReportSchema = new mongoose.Schema({

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

  nurseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  babyTemperature: {
    type: Number,
    required: true
  },

// incubatorTemperature: {
//   type: Number,
//   default: null
// },

//  humidity: {
//   type: Number,
//   default: null
// },

  oxygenSaturation: {
    type: Number,
    required: true
  },

  heartRate: {
    type: Number,
    required: true
  },


  weight: {
    type: Number,
    required: true
  },

  actionsTaken: {
    type: String,
    default: ''
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

module.exports = mongoose.model('HourlyReport', hourlyReportSchema)