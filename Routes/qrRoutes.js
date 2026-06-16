const express = require('express')
const router = express.Router()

const qrController = require('../Controllers/qrController')

// QR open camera
router.get('/:token', qrController.openCameraFromQR)

module.exports = router