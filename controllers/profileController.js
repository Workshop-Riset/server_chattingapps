const {
    Profile, User
} = require('../models/index')
const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

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

    static async uploadImage(req, res, next) {
        try {
            const findProfile = await Profile.findByPk(req.params.id);
            if (!findProfile) {
                throw {name: 'not found', type: 'Profile'}
            }

            if (!req.file) {
                throw {name: 'Please provide a picture'};
            }

            console.log(req.file,'inireqfile');

            const base64Image = req.file.buffer.toString("base64");
            const base64Url = `data:${req.file.mimetype};base64,${base64Image}`;
            // console.log(base64Url,'baseurl');

            const cloudResponse = await cloudinary.uploader.upload(base64Url);
            // console.log(cloudResponse,'>>>>');

            await Profile``.update(
                { photoPofile: cloudResponse.secure_url },
                { where: { id: req.params.id } }
            );

            res.json({ message: 'Image has been uploaded successfully' });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
}



module.exports = ProfileController