const statusCode = require('http-status-codes')
const CurdRepository = require('./curd-repository')
const {Booking} = require('../models');

class BookingRepository extends CurdRepository{
    constructor(){
        super(Booking);
    }
    async createBooking(data, transaction){
        const response = await Booking.create(data,{transaction: transaction});
        return response; 
    }
}

module.exports = BookingRepository;