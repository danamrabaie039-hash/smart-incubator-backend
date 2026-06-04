require('dotenv').config()

const mongoose = require('mongoose')
const bcryptJS = require('bcryptjs')

const User = require('../Models/User')

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("Mongo Connected")
})
.catch((err) => {
  console.log(err)
})

async function seedAdmin() {

  try {

    // delete old admin
    await User.deleteOne({
      email: "admin@smart-incubator.com"
    })

    // hash password
    const hashedPassword = await bcryptJS.hash(
      "Incubator#Admin123",
      10
    )

    // create admin
    const admin = new User({
      name: "System Admin",
      username: "admin",
      displayName: "Admin System",
      badge: "ADM",
      phone: "+970599990000",
      email: "admin@smart-incubator.com",
      password: hashedPassword,
      role: "admin"
    })

    await admin.save()

    console.log("✅ Admin Created Successfully")

    process.exit()

  } catch (error) {

    console.log(error)

    process.exit()

  }

}

seedAdmin()