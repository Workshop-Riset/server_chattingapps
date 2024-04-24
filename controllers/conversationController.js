const {
    Conversation,
    User,
    Message,
    Friend,
    Profile
} = require('../models');

class ConversationController {

    static async getConversations(req, res, next) {
        try {
            const {
                id
            } = req.user
            console.log(id, '<<<<<<<<<<<<');
            
            

            const conversations = await Conversation.findAll({
                where: {
                    receiverId: id
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

            let conversationsWithLastMessage = conversations.map(conversation => {
                const senderLastMessage = conversation.Sender.SentMessages[0]; // Pesan terakhir yang dikirim
                const receiverLastMessage = conversation.Receiver.ReceivedMessages[0]; // Pesan terakhir yang diterima
    
                // Memilih pesan terakhir antara pengirim dan penerima
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

    // static async getConversationById(req, res, next) {
    //     try {
    //         const {
    //             conversationId
    //         } = req.params;
    //         const conversation = await Conversation.findByPk(conversationId, {
    //             include: [{
    //                     model: User,
    //                     as: 'Sender'
    //                 },
    //                 {
    //                     model: User,
    //                     as: 'Receiver'
    //                 },
    //                 {
    //                     model: Message,
    //                     as: 'Messages'
    //                 }
    //             ]
    //         });
    //         if (!conversation) {
    //             return res.status(404).json({
    //                 error: 'Conversation not found'
    //             });
    //         }

    //         res.json(conversation);
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    static async createConversation(req, res, next) {
        try {
            const { receiverId } = req.params;
            const { id: senderId } = req.user;
    
            // Pastikan pengguna telah berteman dengan penerima sebelum mengirim pesan
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
    
            // Periksa apakah percakapan antara pengirim dan penerima sudah ada
            let conversation = await Conversation.findOne({
                where: {
                    senderId,
                    receiverId
                }
            });
    
            // Jika percakapan belum ada, buatlah baru
            if (!conversation) {
                conversation = await Conversation.create({
                    senderId,
                    receiverId
                });
            }
    
            
    
            res.status(200).json({
                message: 'add conversation success'
            });
        } catch (error) {
            next(error);
        }
    }
    
}

module.exports = ConversationController;