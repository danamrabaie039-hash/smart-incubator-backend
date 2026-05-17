const Child = require('../Models/Child')

// ================= CREATE CHILD =================
exports.createChild = async function (req, res) {

  try {

    const child = new Child({

      childName: req.body.childName,

      fatherName: req.body.fatherName,

      motherName: req.body.motherName,

      birthWeek: req.body.birthWeek,

      birthWeight: req.body.birthWeight,

      currentWeight: req.body.currentWeight,

      medicalCondition: req.body.medicalCondition,

      bloodType: req.body.bloodType,

      parentId: req.body.parentId,

      doctorId: req.body.doctorId,

      nurseId: req.body.nurseId,

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