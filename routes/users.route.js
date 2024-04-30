const express = require('express');
// const {body} = require('express-validator');
const router = express.Router()

const usersController = require('../controllers/users.controllers')
const verifyToken = require("../middlewares/verfiyToken")

router.route('/')
        .get(verifyToken,usersController.getAllUsers)
router.route('/register')
       .post(usersController.register)
router.route('/login')
      .post(usersController.login)

  module.exports = router
  //Tabnine   drawio