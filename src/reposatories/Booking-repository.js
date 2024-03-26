const statusCode = require('http-status-codes')
const CurdRepository = require('./curd-repository')
const {Booking} = require('../models');

class BookingRepository extends CurdRepository{
    constructor(){
        super(Booking);
    }
}

module.exports = BookingRepository;