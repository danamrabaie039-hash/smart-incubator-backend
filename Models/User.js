const mongoose = require('mongoose')
const bcryptJS = require('bcryptjs')
const Schema = mongoose.Schema

const userSchema = new Schema({

  name: { 
    type: String, 
    required: true, 
    trim: true 
  },

  username: {
    type: String,
    unique: true,
    required: true
  },

  displayName: { 
    type: String 
  },

  badge: { 
    type: String 
  },

  specialty: {
    type: String,
    default: ""
  },

  age: Number,

  phone: {
    type: String,
    unique: true,
    sparse: true
  },

  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["admin", "engineer", "doctor", "nurse", "parent"],
    default: "parent",
    lowercase: true
  }

}, { timestamps: true })

// ================= PASSWORD CHECK =================
userSchema.methods.comparePassword = async function (password) {
  return await bcryptJS.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema)