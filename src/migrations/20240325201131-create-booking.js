'use strict';
/** @type {import('sequelize-cli').Migration} */
const {Enum} = require('../utils/common');
const {BOOKED, CANCELLED, INITIATED, PENDING} = Enum.BOOKing_STATUS;
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      flightId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status:{
        type: Sequelize.ENUM,
        values:[BOOKED,CANCELLED,INITIATED,PENDING],
        defaultValue: INITIATED,
        allowNull: false
      },
      noOfseats:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1

      },

      totalCost: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};