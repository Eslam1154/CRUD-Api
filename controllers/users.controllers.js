const asyncwrapper = require('../middlewares/asyncwrapper')
const User = require('../models/user.model')
const httpsStatusText = require('../../dev/utils/httpsStatusText')
const appError = require('../../dev/utils/appError')
const bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")
const generateJWT = require('../utils/generateJWT')


const getAllUsers =asyncwrapper( async(req, res, next)=>{


    const query = req.query
    console.log("query: " ,query)
    const limit = query.limit || 10  
    const page  = query.page || 1
    const skip = (page -1 ) * limit

    const users = await User.find({},{"__v":false, "password":false}).limit(limit).skip(skip)
    res.json({stauts: httpsStatusText.SUCCESS , data:{users}})
})

const register = asyncwrapper(async (req, res, next) => {
    console.log(req.body)
    const {firstName, lastName, email, password} = req.body

    const oldUser = await User.findOne({ email: email})
    if (oldUser) {
        const error = appError.create('user already exists',404, httpsStatusText.FAIL)
        return next(error)
    }

    // password hashing
    const hashPassword = await bcrypt.hash(password , 10)


    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashPassword
    })

    const token = await generateJWT({email: newUser.email, password: newUser.password})
    // console.log(token)
    newUser.token = token 

    await newUser.save()
    res.status(201).json({stauts: httpsStatusText.SUCCESS , data:{user:newUser }})
    return
    

})

const login = asyncwrapper (async (req, res, next) => {
    const {email, password} = req.body

    if(!email && !password){
        const error = appError.create('provide email and password',400, httpsStatusText.FAIL)
        return next(error)
    }

    const user = await User.findOne({email: email})

    if(!user){
        const error = appError.create('user not found',400, httpsStatusText.ERROR)
        return next(error)
    }

    const matchedPassword = await bcrypt.compare(password, user.password)

    if(user && matchedPassword){

        const token = await generateJWT({email: user.email, id: user.id})
        // user.tokens = [...user.token, token];
        return res.status(200).json({stauts: httpsStatusText.SUCCESS, data:{token}})
    } else {
        const error = appError.create('invalid email or password',500, httpsStatusText.ERROR)
        return next(error)

    }
})

module.exports = {
    getAllUsers,
    register,
    login
}

