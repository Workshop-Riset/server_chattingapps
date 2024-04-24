const express = require('express')
const ProfileController = require('../controllers/profileController')
const authentication = require('../middlewares/authentication')
const router = express.Router()


router.get('/profiles',authentication,ProfileController.getProfile )
router.post('/profiles', authentication, ProfileController.addProfile)
router.put('/profiles', authentication, ProfileController.updateProfile)


module.exports = router