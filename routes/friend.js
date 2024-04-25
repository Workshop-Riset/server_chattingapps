const express = require('express')
const FriendController = require('../controllers/friendController')
const authentication = require('../middlewares/authentication')
const router = express.Router()

router.get('/friends', authentication, FriendController.getFriends)
router.delete('/friends/:friendId', FriendController.deleteFriend)


module.exports = router