const express = require("express");

const {infoController} = require("../../controllers");
const BookingRoutes = require('./booking');
const router = express.Router();

router.get("/info", infoController);
router.use("/bookings",BookingRoutes)
module.exports = router;
