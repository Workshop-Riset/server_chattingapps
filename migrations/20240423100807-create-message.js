'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      conversationId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Conversations',
          key: 'id'
        }
      },
      senderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          id: 'id'
        }
      },
      receiverId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          id: 'id'
        }
      },
      message: {
        type: Sequelize.STRING
      },
      timestamp: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Messages');
  }
};