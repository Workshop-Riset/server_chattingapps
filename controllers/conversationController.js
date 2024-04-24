const {
    Conversation,
    User,
    Message,
    Friend,
    Profile
} = require('../models');
const { Op } = require('sequelize');

class ConversationController {

    static async getConversations(req, res, next) {
        try {
            const {
                id
            } = req.user
            console.log(id, '<<<<<<<<<<<<');
            
            

            const conversations = await Conversation.findAll({
                where: {
                    [Op.or]: [
                        { senderId: id },
                        { receiverId: id }
                    ]
                },
                include: [{
                        model: User,
                        as: 'Receiver',
                        include : [{
                            model : Message,
                            as : 'ReceivedMessages',
                            order :[
                                ['timestamp', 'DESC']
                            ]
                        }]
                    },
                    {
                        model: User,
                        as: 'Sender',
                        include : [{
                            model : Message,
                            as : 'SentMessages',
                            order :[
                                ['timestamp', 'DESC']
                            ]
                        }]
                    }
                ]
            });
            // console.log(conversations, '<<<<<');
            let conversationsWithLastMessage = conversations.map(conversation => {
                const senderLastMessage = conversation.Sender.SentMessages[0]; 
                const receiverLastMessage = conversation.Receiver.ReceivedMessages[0]; 
    
                let lastMessage;
                let sender;
    
                if (!senderLastMessage && !receiverLastMessage) {
                    lastMessage = null;
                    sender = null;
                } else if (!senderLastMessage) {
                    lastMessage = receiverLastMessage;
                    sender = conversation.Receiver;
                } else if (!receiverLastMessage) {
                    lastMessage = senderLastMessage;
                    sender = conversation.Sender;
                } else {
                    lastMessage = senderLastMessage.timestamp > receiverLastMessage.timestamp.getTime()
                        ? senderLastMessage
                        : receiverLastMessage;
    
                    sender = senderLastMessage.timestamp > receiverLastMessage.timestamp.getTime()
                        ? conversation.Sender
                        : conversation.Receiver;
                }
    
                return {
                    conversation,
                    lastMessage,
                    sender
                };
            });
            // console.log(conversationsWithLastMessage, '<<<<<');
            let newConv = conversationsWithLastMessage.map((el) => {
                let data = {
                    id : el.conversation.id,
                    username : el.sender.username,
                    lastMessage : el.lastMessage.message
                }
                return data
            })
            res.status(200).json(newConv);
        } catch (error) {
            next(error);
        }
    }

    static async createConversation(req, res, next) {
        try {
            const { receiverId } = req.params;
            const { id: senderId } = req.user;
    
            const isFriend = await Friend.findOne({
                where: {
                    userId: senderId,
                    friendId: receiverId
                }
            });
            if (!isFriend) {
                throw {
                    name: 'unauthorized',
                    message: 'Kamu belum berteman dengan penerima'
                };
            }
    
            let conversation = await Conversation.findOne({
                where: {
                    senderId,
                    receiverId
                }
            });
            // if()
            if(conversation){
                res.status(400).json({message : `You've added to the conversation with him`})
            }

            if (!conversation) {
                conversation = await Conversation.create({
                    senderId,
                    receiverId
                });
            }
    
            
    
            res.status(200).json({
                message: 'Add Conversation Success'
            });
        } catch (error) {
            next(error);
        }
    }
    
}

module.exports = ConversationController;