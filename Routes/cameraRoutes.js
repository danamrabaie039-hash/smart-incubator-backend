const express = require("express");
const router = express.Router();

const cameraController = require("../Controllers/cameraController");


// register camera (ESP32 → backend)
router.post("/register", cameraController.registerCamera);



module.exports = router

