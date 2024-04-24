const jwt = require('jsonwebtoken')
const secret = process.env.jwt_secret

const createToken = (payload) => jwt.sign(payload, process.env.jwt_secret)

const verifyToken = (token) => jwt.verify(token, process.env.jwt_secret)

module.exports = {createToken, verifyToken}
