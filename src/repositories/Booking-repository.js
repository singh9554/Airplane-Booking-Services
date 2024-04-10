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
    async get(data, transaction) {
        const response = await Booking.findByPk(data,{transaction: transaction});
        if(!response){
          throw new AppError('not able to find the resource', StatusCodes.NOT_FOUND)
        }
        return response;
      }

      async update(id, data, transaction) {
        const [response] = await this.model.update(data, {
          where : {
              id : id
          }
        },{transaction: transaction});
        return response;
    }
  }

module.exports = BookingRepository;