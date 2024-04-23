'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Conversation.belongsTo(models.User, { foreignKey: 'senderId', as: 'Sender' });
      Conversation.belongsTo(models.User, { foreignKey: 'receiverId', as: 'Receiver' });
      Conversation.hasMany(models.Message, { foreignKey: 'conversationId', as: 'Messages' });
    }
    
  }
  Conversation.init({
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Conversation',
  });
  return Conversation;
};