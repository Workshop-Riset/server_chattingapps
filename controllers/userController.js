const {
    User,
    Friend
} = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {
    createToken
} = require('../helpers/jwt')
const {
    where
} = require('sequelize')
const {
    Op
} = require('sequelize')
const e = require('express')
const {
    OAuth2Client
} = require('google-auth-library')


const client = new OAuth2Client()
const client_id = process.env.client_id

class UserController {
    static async register(req, res, next) {
        try {
            let newUser = await User.create(req.body)
            newUser = {
                "id": newUser.id,
                "username": newUser.username,
                "email": newUser.email,
                "phoneNumber": newUser.phoneNumber,
            }
            console.log(req.body);
            res.status(201).json(newUser)
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const {
                email,
                password
            } = req.body
            if (!email || !password) {
                throw {
                    name: "Email and Password are required"
                }
            }

            const findUser = await User.findOne({
                where: {
                    email: email
                }
            })
            if (!findUser) {
                throw {
                    name: "Invalid email/password"
                }
            }

            const verifyPassword = await bcrypt.compare(password, findUser.password)
            if (!verifyPassword) {
                throw {
                    name: "Invalid email/password"
                }
            }

            const payload = {
                id: findUser.id
            }
            const accessToken = createToken(payload)
            res.status(200).json({
                accessToken
            })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async search(req, res, next) {
        try {
            const {
                username
            } = req.query;
            console.log(username, '<<<<');
            // if (!search) {
            //     return res.status(400).json({ error: 'Parameter "search" is required' });
            // }

            const users = await User.findAll({
                where: {
                    username: {
                        [Op.iLike]: `${username}`
                    }
                },
                attributes: ['id', 'username', 'email', 'phoneNumber']
            });

            if (!users) {
                throw {
                    name: 'not found',
                    type: 'User'
                }
            }

            res.json(users);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async addFriend(req, res, next) {
        try {
            const {
                idFriend: friendId
            } = req.params
            const {
                id: userId
            } = req.user

            if(Number(friendId) === userId){
                throw {name : 'SameId', type : 'users'} //err message you cannot add self
            }
            
            const friendList = await Friend.findAll()

            let data = friendList.filter(user => user.userId === userId) //dia filter friendList punya dia sendiri di filter
            console.log(data , '<<<<<<<<');
            if(data.find(e => e.friendId === Number(friendId))){ //handler error ketika add friend id yang sama
                throw {name : 'BadRequest'}
            }
            // console.log(friendId, '>>');

            const findId = await User.findByPk(friendId)
            if(!findId){
                throw {name : 'not found', type : 'users'} //400 bad request
            }
            
            const newFriend = await Friend.create({
                friendId,
                userId
            })
            // console.log(data, '<<<<<');
            

            // res.status(201).json(data)
            res.status(201).json({message : 'Add friend successfully'})
        } catch (error) {
            // console.log(error);
            next(error)
        }
    }

    static async googleLogin(req, res, next) {
        try {
            const {
                tokengoogle
            } = req.headers

            const ticket = await client.verifyIdToken({
                idToken: tokengoogle,
                audience: client_id
            });

            const googlePayload = ticket.getPayload()

            const [user, created] = await User.findOrCreate({
                where: {
                    email: googlePayload.email
                },
                defaults: {
                    username: googlePayload.name,
                    email: googlePayload.email,
                    password: String(Math.random() * 1000)
                }
            })

            const payload = {
                id: user.id
            }

            const accessToken = createToken(payload)

            res.status(200).json({
                accessToken
            })
        } catch (error) {
            next(error)
        }
    }



}

module.exports = UserController