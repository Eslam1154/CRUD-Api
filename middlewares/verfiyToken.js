const jwt = require("jsonwebtoken")
const httpStatusText = require("../utils/httpsStatusText")
const appError = require("../utils/appError")

const verifyToken = (req, res, next)=>{
    const authHeader = req.headers['Authorization']|| req.headers['authorization']
    if(!authHeader) {
        const error = appError.create("token is required",401, httpStatusText.ERROR)
        return next(error)
    }
    const token = authHeader.split(' ')[1]

    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY)
        next()

    } catch (err) {
        // return res.status(401).json('invalid token')
        const error = appError.create("invalid token",401, httpStatusText.ERROR)
        return next(error)
    }
    // console.log("decodedToken: ",decodedToken)
    // console.log("token: ", token)
}
module.exports= verifyToken