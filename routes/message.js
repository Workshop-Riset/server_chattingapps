const express = require('express')
const MessageController = require('../controllers/messageController')
const authentication = require('../middlewares/authentication')
const router = express.Router()

router.get('/conversations/:conversationId/messages',authentication, MessageController.getAllMessages)
router.post('/conversations/:conversationId/messages/:receiverId', authentication,MessageController.createMessage)


module.exports = router