// const mongoose = require('mongoose')

// const alertSchema = new mongoose.Schema({

//   childId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Child',
//     required: true
//   },

//   incubatorId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Incubator',
//     required: true
//   },

//   // alertType: {
//   //   type: String,
//   //   enum: [
//   //     // Medical Alerts
//   //     'baby_high_temperature',
//   //     'baby_low_temperature',
//   //     'low_oxygen',
//   //     'high_oxygen',
//   //     'low_heart_rate',
//   //     'high_heart_rate',

//   //     // Technical Alerts (للمستقبل)
//   //     'sensor_offline',
//   //     'fan_failure',
//   //     'heater_failure',
//   //     'humidifier_failure'
//   //   ],
//   //   required: true
//   // },
// alertType: {
//   type: String,
//   enum: [

//     // 🟢 Medical (Nurse)
//     'baby_high_temperature',
//     'baby_low_temperature',
//     'low_oxygen',
//     'high_oxygen',
//     'low_heart_rate',
//     'high_heart_rate',

//     // 🟡 Incubator environment (Engineer alerts but NOT medical)
//     'incubator_high_temperature',
//     'high_humidity',
//     'low_humidity',
//     'gas_detected',

//     // 🔴 System failures (future engineer)
//     'sensor_offline',
//     'fan_failure',
//     'heater_failure',
//     'humidifier_failure',
//     'alarm_active'
//   ],
//   required: true
// }
//   // type: {
//   //   type: String,
//   //   enum: ['medical', 'technical'],
//   //   required: true
//   // },

//   targetRole: {
//     type: String,
//     enum: ['nurse', 'engineer'],
//     required: true
//   },

//   alertLevel: {
//     type: String,
//     enum: ['low', 'medium', 'high', 'critical'],
//     default: 'medium'
//   },

//   message: {
//     type: String,
//     required: true
//   },

//   status: {
//     type: String,
//     enum: ['active', 'resolved', 'ignored'],
//     default: 'active'
//   },

//   sensorSnapshot: {
//     incubatorTemperature: Number,
//     babyTemperature: Number,
//     humidity: Number,
//     oxygenSaturation: Number,
//     heartRate: Number,
//     gas: Number,
//     alarmActive: Boolean
//   }

// }, {
//   timestamps: true
// })

// module.exports = mongoose.model('Alert', alertSchema)

const mongoose = require('mongoose')

const alertSchema = new mongoose.Schema({

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

  alertType: {
    type: String,
    enum: [

      // Medical
      'baby_high_temperature',
      'baby_low_temperature',
      'low_oxygen',
      'high_oxygen',
      'low_heart_rate',
      'high_heart_rate',

      // Engineer / Environment
      'incubator_high_temperature',
      'high_humidity',
      'low_humidity',
      'gas_detected',

      // System
      'sensor_offline',
      'fan_failure',
      'heater_failure',
      'humidifier_failure',
      'alarm_active'
    ],
    required: true
  },

  targetRole: {
    type: String,
    enum: ['nurse', 'engineer'],
    required: true
  },

  alertLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },

  message: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ['active', 'resolved', 'ignored'],
    default: 'active'
  },

  sensorSnapshot: {
    incubatorTemperature: Number,
    babyTemperature: Number,
    humidity: Number,
    oxygenSaturation: Number,
    heartRate: Number,
    gas: Boolean,
    alarmActive: Boolean
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Alert', alertSchema)