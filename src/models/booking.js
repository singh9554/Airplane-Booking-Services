'use strict';
const {
  Model
} = require('sequelize');
const {Enum} = require('../utils/common');
const {BOOKED, CANCELLED, INITIATED, PENDING} = Enum.BOOKing_STATUS;
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init({
    flightId:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status:{
      type: DataTypes.ENUM,
      values:[BOOKED,CANCELLED,INITIATED,PENDING],
      defaultValue: INITIATED,
      allowNull: false
    },
    totalCost:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    noOfseats:{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};