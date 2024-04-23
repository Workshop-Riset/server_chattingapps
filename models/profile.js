'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      Profile.belongsTo(models.User, { foreignKey: 'userId', as: 'User' });
    }
  }

  Profile.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        isInt: {
          msg: 'User ID must be an integer'
        },
        notNull: {
          msg: 'User ID cannot be null'
        }
      }
    },
    photoProfile: DataTypes.STRING,
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'FullName cannot be empty'
        },
        len: {
          args: [2],
          msg: 'FullName must be at least 2 characters'
        }
      }
    },    
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [4, 300],
          msg: 'Address must be between 4 and 300 characters'
        }
      }
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [4, 300],
          msg: 'Bio must be between 4 and 300 characters'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });

  return Profile;
};
