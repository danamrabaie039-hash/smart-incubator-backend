const mongoose = require('mongoose')

const userChildAccessSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },

  accessStatus: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },

  startDate: {
    type: Date,
    default: Date.now
  },

  endDate: {
    type: Date,
    default: null
  }

}, {
  timestamps: true
})


module.exports = mongoose.model('UserChildAccess', userChildAccessSchema)