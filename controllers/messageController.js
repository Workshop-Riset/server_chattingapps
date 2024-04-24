const {
    Message,
    Conversation,
    User
} = require('../models');

class MessageController {

    static async getAllMessages(req, res, next) {
    try {
        const { conversationId } = req.params;
        const { id } = req.user;
        console.log(id, 'ini idi');
        let conversation = await Conversation.findByPk(conversationId);
        // const receiverId = conversation.receiverId;
        if(!conversation){
            res.status(404).json({message : 'Conversation not found'})
        }

        let conversationMessages = await Conversation.findByPk(conversationId, {
            include: [{
                model: Message,
                as: 'Messages',
                order: [
                    ['timestamp', 'ASC']
                ]
            }, {
                model: User,
                as: 'Receiver',
            }]
        });

        
        
        conversationMessages = {
            id: conversationMessages.id,
            message: conversationMessages.Messages,
            receiverName: conversationMessages.Receiver.username,
            receiverId : conversationMessages.Receiver.id
        };

        res.status(200).json(conversationMessages);
    } catch (error) {
        // console.log(error, '<<<<<');
        next(error);
    }
}



    static async createMessage(req, res, next) {
        try {
            const {
                conversationId,receiverId
            } = req.params;

            const {
                id: senderId
            } = req.user
            console.log(conversationId, '<<<<');

            const {
                message
            } = req.body;

            const conversation = await Conversation.findByPk(conversationId, {where : {senderId, receiverId}});

            console.log(conversation, 'INI CONVERSATION');


            
            if (!conversation) {
                throw {
                    name: 'not found',
                    type: 'Conversation'
                }
            }

            if(conversation.senderId != senderId){
                res.status(403).json({message : 'You are not authorized'})
            }

            if(conversation.receiverId != receiverId){
                res.status(403).json({message : 'You are not authorized'})
            }

            const newMessage = await Message.create({
                conversationId,
                senderId,
                receiverId: conversation.receiverId,
                message,
            });

            res.status(201).json({
                message: 'Send Message Success'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = MessageController;