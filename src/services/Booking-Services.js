const axios = require('axios');
const statusCode = require('http-status-codes')
const {BookingRepository} = require('../repositories')
const bookingRepository = new BookingRepository()
const db = require('../models');
const {serverconfig} = require('../config')
const AppError = require('../utils/Error/app-error');
async function createBooking(data){
    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.get(`${serverconfig.Flight_service}/api/v1/flight/${data.flightId}`);
        const flightData = flight.data.data;
        if (parseInt(data.noOfseats) > flightData.totalSeats) {
            throw new AppError('Not enough seats available', statusCode.BAD_REQUEST);
        }
        const totalBillingAmount = data.noOfseats * flightData.price;
        const bookingPayLoad = {...data,totalCost : totalBillingAmount}
        const booking = await bookingRepository.create(bookingPayLoad, transaction)

        await axios.patch(`${serverconfig.Flight_service}/api/v1/flight/${data.flightId}/seats`,{
            seats : data.noOfseats
        })
        await transaction.commit();
        return booking;
    } catch (error) {
    await transaction.rollback();
       throw error;
    }
}
module.exports = {
    createBooking
}