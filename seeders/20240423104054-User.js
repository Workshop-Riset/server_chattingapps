'use strict';

const { hashPassword } = require('../helpers/hash');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = require('../data/users.json');
    data = await Promise.all(data.map(async (el) => {
      el.createdAt = el.updatedAt = new Date();
      el.password = await hashPassword(el.password);
      return el;
    }));

    await queryInterface.bulkInsert('Users', data, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
