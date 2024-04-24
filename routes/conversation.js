const express = require('express')
const ConversationController = require('../controllers/conversationController')
const authentication = require('../middlewares/authentication')
const router = express.Router()

router.get('/conversations',authentication, ConversationController.getConversations)
// router.get('/conversations/:conversationsId',authentication, ConversationController.getConversationById)
router.post('/conversations/:receiverId',authentication,ConversationController.createConversation)




module.exports = router