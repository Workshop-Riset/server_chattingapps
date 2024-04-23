const {verifyToken} = require('../helpers/jwt')
const { User } = require('../models')

async function authentication(req, res, next){
    try {
        if(!req.headers.authorization){
            throw { name: "Invalid_Token"}
        }
        
        const token = req.headers.authorization.split(' ')[1]
        console.log(token,'>>>');

        const payload = verifyToken(token)

        const findUser = await User.findByPk(payload.id)

        if(!findUser) throw { name: "Invalid_Token"}

        req.user = {
            id: payload.id,
            role: findUser.role,
            email: findUser.email
        }

        next()
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = authentication