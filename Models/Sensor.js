const mongoose = require('mongoose')

const sensorSchema = new mongoose.Schema({

  incubatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Incubator",
    required: true
  },
childId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Child",
  required: true
 },

  // 🟡 Incubator environment
  incubatorTemperature: {
    type: Number,
    required: true
  },
babyTemperature: {
  type: Number,
  required: true
},
  humidity: {
    type: Number,
    required: true
  },

  // 🟡 Baby health (SpO2 sensor)
  oxygenSaturation: {
    type: Number,
    required: true
  },

  heartRate: {
    type: Number,
    required: true
  },

  // 🟡 optional future AI feature (cry detection)
  soundLevel: {
    type: Number,
    default: null
  },


}, {
  timestamps: true
})

module.exports = mongoose.model("Sensor", sensorSchema)