const express = require('express')
const ProfileController = require('../controllers/profileController')
const authentication = require('../middlewares/authentication')
const router = express.Router()


module.exports = router