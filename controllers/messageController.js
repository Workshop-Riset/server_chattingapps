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
        console.log(id, '<<<<<<');
        let conversation = await Conversation.findByPk(conversationId);
        const receiverId = conversation.receiverId;

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

        // // Convert timestamp to time value
        // conversationMessages.Messages.forEach(message => {
        //     message.timestamp = new Date(message.timestamp).getTime();
        // });

        conversationMessages = {
            id: conversationMessages.id,
            message: conversationMessages.Messages,
            receiverName: conversationMessages.Receiver.username
        };

        res.status(200).json(conversationMessages);
    } catch (error) {
        next(error);
    }
}



    static async createMessage(req, res, next) {
        try {
            const {
                conversationId
            } = req.params;
            const {
                id: senderId
            } = req.user
            console.log(conversationId, '<<<<');
            const {
                message
            } = req.body;
            const conversation = await Conversation.findByPk(conversationId);

            console.log(conversation, '<<<<<');
            if (!conversation) {
                throw {
                    name: 'not found',
                    type: 'Conversation'
                }
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