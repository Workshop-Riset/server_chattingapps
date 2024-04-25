const express = require('express')
const UserController = require('../controllers/userController')
const authentication = require('../middlewares/authentication')
const router = express.Router()

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/users/search?',authentication ,UserController.search)
router.post('/users/:idFriend/add-friend', authentication,UserController.addFriend)
router.post('/login-Google', UserController.googleLogin)


module.exports = router