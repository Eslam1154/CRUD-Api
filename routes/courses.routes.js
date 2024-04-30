const express = require('express');
// const {body} = require('express-validator');
const router = express.Router()
const courseController = require('../controllers/courses.controllers');
const { validationSchema } = require('../middlewares/validationSchema');

router.route('/')
        .get(courseController.getAllCourses)
        .post(validationSchema(),courseController.addCourse)

router.route('/:courseId')
        .get (courseController.getCourse )
        .patch(courseController.updateCourse)
        .delete(courseController.deleteCourse)

  module.exports = router
  //Tabnine   drawio