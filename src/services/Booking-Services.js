const axios = require('axios');
const statusCode = require('http-status-codes')
const {BookingRepository} = require('../repositories')
const bookingRepository = new BookingRepository()
const db = require('../models');
const {serverconfig} = require('../config')
const AppError = require('../utils/Error/app-error');
const {Enum} = require('../utils/common');
const {BOOKED, CANCELLED} = Enum.BOOKing_STATUS;

//Create Booking;
async function createBooking(data){
    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.get(`${serverconfig.Flight_service}/api/v1/flight/${data.flightId}`);
        const flightData = flight.data.data;
        if ( +data.noOfseats > flightData.totalSeats) {
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

//Make Payments;

async function makePayment(data){
    const transaction = await db.sequelize.transaction();
try {
    const bookingDetails = await bookingRepository.get(data.bookingId, transaction);
    if(bookingDetails.status == CANCELLED){
        throw new AppError('The Booking has been Cancelled', statusCode.BAD_REQUEST); 
    }
    const bookingTime = new Date(bookingDetails.createdAt);
    const currentTime = new Date();
    if(currentTime - bookingTime > 300000){
        await cancelBooking(data.bookingId)
        throw new AppError('Connection Timed OUT! Payment Window Closed!', statusCode.BAD_REQUEST);
    }
    if(bookingDetails.totalCost != data.totalCost){
        throw new AppError('The Amount of the payment does not match', statusCode.BAD_REQUEST);
    }
    if(bookingDetails.userId != data.userId){
        throw new AppError('The user corresponding to the booking does not match', statusCode.BAD_REQUEST);
        }
        //If both the conditon satisfied then we can assume that the payment is successful
       await bookingRepository.update(data.bookingId,{status : BOOKED },transaction);
        await transaction.commit();
    }   
 catch (error) {
    await transaction.rollback();
    throw error;
}
}

// Cancel Booking function
async function cancelBooking(bookingId){
    const transaction = await db.sequelize.transaction();
    try {
    const bookingDetails = await bookingRepository.get(bookingId, transaction);
    if(bookingDetails.status == CANCELLED){
        await transaction.commit();
        return true;
    }
    await axios.patch(`${serverconfig.Flight_service}/api/v1/flight/${bookingDetails.flightId}/seats`,{
        seats : bookingDetails.noOfseats,
        desc : 0
    });
    await bookingRepository.update(bookingId,{status : CANCELLED },transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
module.exports = {
    createBooking,
    makePayment,
}