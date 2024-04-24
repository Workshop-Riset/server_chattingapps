const express = require('express')
const ProfileController = require('../controllers/profileController')
const authentication = require('../middlewares/authentication')
const router = express.Router()
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

router.get('/profiles',authentication,ProfileController.getProfile )
router.post('/profiles', authentication, ProfileController.addProfile)
router.put('/profiles', authentication, ProfileController.updateProfile)


router.patch('/profiles/:id', upload.single("foto"), ProfileController.uploadImage)


module.exports = router