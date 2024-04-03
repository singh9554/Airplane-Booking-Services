const statusCode = require('http-status-codes')
const {BookingServices} = require('../services')
const { SuccessResponse, ErrorResponse } = require("../utils/common");
async function createBooking(req,res){
try {
    const response = await BookingServices.createBooking({
        flightId: req.body.flightId,
        userId: req.body.userId,
        noOfseats: req.body.noOfseats
    })
    SuccessResponse.data = response;
    return res.status(statusCode.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}
module.exports = {
    createBooking
}