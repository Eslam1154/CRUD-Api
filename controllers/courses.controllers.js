const { validationResult } = require('express-validator')
const Course = require('../models/courses.model')
const httpsStatusText = require('../utils/httpsStatusText')
const asyncwrapper = require('../middlewares/asyncwrapper')
const appError = require('../utils/appError')

const getAllCourses = asyncwrapper( async(req, res, next)=>{
    const query = req.query
    console.log("query: " ,query)
    const limit = query.limit || 10  
    const page  = query.page || 1
    const skip = (page -1 ) * limit

    const courses = await Course.find({},{"__v":false}).limit(limit).skip(skip)
    res.json({stauts: httpsStatusText.SUCCESS , data:{courses}})
})

const getCourse = asyncwrapper(async (req , res, next)=>{
  
        const course = await Course.findById(req.params.courseId)
        if(!course){

            const error = appError.create("course not found", 404, httpsStatusText.FAIL)
            return next(error)
        }
        res.json({stauts: httpsStatusText.SUCCESS , data:{course}})

})

const addCourse = asyncwrapper ( async(req, res, next) =>{
const errors = validationResult(req);
if(!errors.isEmpty()){
    const error =  appError.create(errors.array(), 400, httpsStatusText.FAIL)
    return next(error)
}


const newCourse = new Course(req.body)
await newCourse.save()

res.status(201).json({stauts: httpsStatusText.SUCCESS , data:{courses:newCourse }})

})

const updateCourse =asyncwrapper( async (req , res )=>{
    const courseId = req.params.courseId
        const updateCourse =await Course.updateOne({_id: courseId} ,{$set: {...req.body}})

        if(!updateCourse){
            return res.status(404).json({stauts: httpsStatusText.FAIL , data:{courses: 'course not found'}})
        }  
        return res.status(200).json({stauts: httpsStatusText.SUCCESS , data:{courses:updateCourse }})
 
})
    
const deleteCourse =asyncwrapper( async (req, res )=>{
    const data = await Course.deleteOne({_id: req.params.courseId})
    res.status(200).json({status:httpsStatusText.SUCCESS, data: null})

  })

  module.exports = {
    getAllCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
  }