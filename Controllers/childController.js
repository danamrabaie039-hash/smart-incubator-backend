const Child = require('../Models/Child')

// ================= CREATE CHILD =================
exports.createChild = async function (req, res) {

  try {

    const child = new Child({

      name: req.body.name,

      age: req.body.age,

      gender: req.body.gender,

      parentId: req.body.parentId,

      doctorId: req.body.doctorId,

      engineerId: req.user._id

    })

    const savedChild = await child.save()

    return res.status(201).json({

      status: "success",

      message: "Child created successfully",

      data: {
        child: savedChild
      }

    })

  } catch (error) {

    return res.status(400).json({

      status: "error",

      message: error.message

    })

  }

}