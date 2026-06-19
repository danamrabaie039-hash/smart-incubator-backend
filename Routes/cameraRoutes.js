const express = require("express");
const router = express.Router();

const cameraController = require("../Controllers/cameraController");


// register camera (ESP32 → backend)
router.post("/register", cameraController.registerCamera);


// stream camera (frontend → backend → ESP32)
router.get("/incubator/:id/stream", cameraController.streamCamera);

module.exports = router
