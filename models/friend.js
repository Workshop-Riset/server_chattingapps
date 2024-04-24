'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Friend.belongsTo(models.User, { foreignKey: 'userId', as: 'Owner' });
      Friend.belongsTo(models.User, { foreignKey: 'friendId', as: 'FriendUser' }); // Ubah asosiasi ini menjadi 'FriendUser'
    }
    
    
  }
  Friend.init({
    userId: DataTypes.INTEGER,
    friendId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Friend',
  });
  return Friend;
};