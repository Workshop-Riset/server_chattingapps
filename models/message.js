'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Conversation, { foreignKey: 'conversationId', as: 'Conversation' });
      Message.belongsTo(models.User, { foreignKey: 'senderId', as: 'Sender' });
      Message.belongsTo(models.User, { foreignKey: 'receiverId', as: 'Receiver' });
    }
  }

  Message.init({
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Conversation ID must be an integer'
        },
        notNull: {
          msg: 'Conversation ID cannot be empty'
        },
        notEmpty: {
          msg: 'Conversation ID cannot be empty'
        }
      }
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Sender ID must be an integer'
        },
        notNull: {
          msg: 'Sender ID cannot be empty'
        },
        notEmpty: {
          msg: 'Sender ID cannot be empty'
        }
      }
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Receiver ID must be an integer'
        },
        notNull: {
          msg: 'Receiver ID cannot be empty'
        },
        notEmpty: {
          msg: 'Receiver ID cannot be empty'
        }
      }
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Message cannot be empty'
        },
        notNull: {
          msg: 'Message cannot be empty'
        }
      }
    },
    timestamp: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    hooks : {
      beforeCreate : (message) => {
        let timeNow = new Date()
        let time = timeNow.getTime()
        message.timestamp = time
      }
    },
    modelName: 'Message',
  });

  return Message;
};
