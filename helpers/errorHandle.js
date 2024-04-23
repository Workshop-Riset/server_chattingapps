const e = require("express");

function errorHandler(error, req, res, next) {
    let message = "Internal Server Error";
    let code = 500;
    console.log(error);
    if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
        code = 400;
        message = error.errors[0].message;
    } else if (error.name === "Invalid_Token" || error.name === 'JsonWebTokenError') {
        code = 401;
        message = "Invalid Token";
    } else if (error.name === "unauthorized") {
        code = 401;
        if (error.name === "User not found" || error.name === "Password not matched") {
            message = error.name;
        } else {
            message = "Authentication failed";
        }
    } else if (error.name === 'unauthorrized') {
        code = 403;
        message = 'Forbidden';
    } else if (error.name === 'not found' || error.name === 'Product not found') {
        code = 404;
        message = `${error.type} not found`;
    } else if (error.name === "Email and Password are required") {
        code = 400;
        message = error.name;
    } else if (error.name === "Invalid email/password") {
        code = 401;
        message = error.name;
    } else if (error.name === 'not found') {
        code = 404
        message = `${error.type} not found`
    } else if (error.name === 'SameId') {
        // console.log('aku sampe sini ga');
        code = 400
        message = `You cannot add self`
    }else if(error.name === 'BadRequest'){
        code = 400
        message = 'Kamu udah add user itu'
    }

    res.status(code).json({
        message
    });
}

module.exports = errorHandler;