const {
    Profile, User
} = require('../models/index')

class ProfileController {
    static async getProfile(req, res, next) {
        try {
            const {
                id: userId
            } = req.user
            const getProfile = await Profile.findOne({
                where: {
                    userId
                },
                include : {model : User, as : 'User'}
            })
            // res.send(getProfile)
            res.status(200).json(getProfile)
        } catch (error) {
            next(error)
        }
    }

    static async addProfile(req,res,next){
        try {
            const {
                id: userId
            } = req.user
            let addProfile = await Profile.create({
                userId,
                fullName : req.body.fullName,
                address : req.body.address,
                bio : req.body.bio
            })

            addProfile = {
                fullName : addProfile.fullName,
                address : addProfile.address,
                bio : addProfile.bio,
            }
            res.status(201).json(addProfile)
        } catch (error) {
            next(error)
        }
    }

    static async updateProfile(req,res,next){
        try {
            const {
                id: userId
            } = req.user
            let updateProfile = await Profile.update({
                userId,
                fullName : req.body.fullName,
                address : req.body.address,
                bio : req.body.bio
            },{
                where : {userId}
            })
            // updateProfile = {
            //     fullName : addProfile.fullName,
            //     address : addProfile.address,
            //     bio : addProfile.bio,
            // }
            res.status(200).json({message : 'update profile success'})
        } catch (error) {
            next(error)
        }
    }
}



module.exports = ProfileController