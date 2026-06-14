const mongoose = require('mongoose')

const sensorSchema = new mongoose.Schema({

  incubatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Incubator",
    required: true,
     index: true
  },
childId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Child",
  required: true,
    index: true
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


 // Hardware Status
  heater: {
    type: Boolean,
    default: false
  },

  fan: {
    type: Boolean,
    default: false
  },

  humidifier: {
    type: Boolean,
    default: false
  },

  // exhaust: {
  //   type: Boolean,
  //   default: false
  // },

  // // Water Tank
  // waterLevel: {
  //   type: Number,
  //   default: null
  // },

  // Gas Detection
gas: {
   type: Number,
   required: true
},

  // Buzzer / Alarm State
  alarmActive: {
    type: Boolean,
    default: false
  },
// dataType: {
//   type: String,
//   enum: ['patient', 'device'],
//   required: true,
//   index: true
// }
}, {
  timestamps: true
})
sensorSchema.index({ createdAt: -1 })
module.exports = mongoose.model("Sensor", sensorSchema)