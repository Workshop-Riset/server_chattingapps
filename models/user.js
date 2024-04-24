'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/hash');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile, { foreignKey: 'userId', as: 'Profile' });
      User.hasMany(models.Conversation, { foreignKey: 'senderId', as: 'SentConversations' });
      User.hasMany(models.Conversation, { foreignKey: 'receiverId', as: 'ReceivedConversations' });
      User.hasMany(models.Friend, { foreignKey: 'userId', as: 'OwnFriends' });
      User.hasMany(models.Friend, { foreignKey: 'friendId', as: 'Friends' });
      User.hasMany(models.Message, { foreignKey: 'senderId', as: 'SentMessages' });
      User.hasMany(models.Message, { foreignKey: 'receiverId', as: 'ReceivedMessages' });
    }
    
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Username must be unique'
      },
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Username cannot be empty'
        },
        notNull: {
          msg: 'Username cannot be empty'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Email must be unique'
      },
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Email is required'
        },
        notNull: {
          msg: 'Email cannot be empty'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password is required'
        },
        notNull: {
          msg: 'Password cannot be empty'
        }
      }
    },
    phoneNumber: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        user.password = hashPassword(user.password); 
      }
    }
  });
  return User;
};