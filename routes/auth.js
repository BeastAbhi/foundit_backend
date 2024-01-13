const express = require('express');
const router = express.Router()
const User = require('../models/User');
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const fetchuser = require('../middleware/fetchUser')

secreate = process.env.JWT_SECRET;

//Rout 1: Create a User using: POST "/api/auth/signup" . NO login required
router.post('/signup', [
body('name', "Name should be at least 3 characters").isLength({ min:3 }),
body('email', 'Invalid Email').isEmail(),
body('password', 'Password must be at leat 6 characters').isLength({ min:6 })
], async (req, res)=>{

//This will validate the entred data and respond as per the data
//It will return bad request if there are any errors in the data
const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false
      return res.status(400).json({success, errors: errors.array() });
    }
    try {
      //This will check wheather user already exists with this email
      let user = await User.findOne({ email: req.body.email })
      if(user){
        success = false
        return res.status(400).json({success, error: "Sorry a user with this email already exists"})
      }

      //This will encrypt the password
      //We are using the npm package bcrypt for encryption
      const salt = await bcrypt.genSalt(10)
      const secPass = await bcrypt.hash(req.body.password, salt)

      //This will create new user
      user = await User.create({
          name: req.body.name,
          password: secPass,
          email: req.body.email,
        })

        // This is use for verifying the user by Json web token
        //And will generate authintication token for the user
        const data = {
          user:{
            id: user.id
          }
        }
        const authtoken = jwt.sign(data, secreate)
        success = true
        res.json({success, authtoken})

      } catch (error) {
      console.error(error.message)
      success = false
      res.status(500).send(success, "Oops some thing went wrong!!")
    }
})

//Rout 2: Authenticateing an user using: POST "/api/auth/login" . NO login required
router.post('/login',[
  body('email', 'Invalid Email').isEmail(),
  body('password', 'Password cannot be blank').exists()
  ], async (req, res)=>{

    //This will validate the entred data and respond as per the data
    //It will return bad request if there are any errors in the data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false
      return res.status(400).json({ success, errors: errors.array() });
    }
    const {email, password} = req.body
    try {
      //This will check if user entered correct credentials
      let user = await User.findOne({email})
      if(!user){
        success = false
        return res.status(400).json({success, error: "Please Try to login with correct credentials!"})
      }
      const passCompair = bcrypt.compare(password, user.password)
      if(!passCompair){
        success = false
        return res.status(400).json({success, error: "Please Try to login with correct credentials!"})
      }

        // This is use for verifying the user by Json web token
        //And will generate authintication token for the user
        //This id will be preasent in the authtoken
        const data = {
          user:{
            id: user.id
          }
        }
        const authtoken = jwt.sign(data, secreate)
        success = true
        res.json({success, authtoken})

    } catch (error) {
      success = false
      console.error(error.message)
      res.status(500).send(success, "Oops some thing went wrong!!")
    }
})


//Rout 3: Getting User data using: POST "/api/auth/getuser" . login require
//The fecthuser in the below line is for authanticate the authtoken send by the user
router.post('/getuser', fetchuser, async (req, res)=>{
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user)
      
    } catch (error) {
      console.error(error.message)
      res.status(500).send("Oops some thing went wrong!!")
    }
})

//Rout 4: Updating User data using: PUT "/api/auth/updateuser" . login require
router.put('/updateuser', fetchuser,[
  body('email', 'Invalid Email').isEmail(),
  body('password', 'Password cannot be blank').exists()
], async(req, res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    success = false
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {
    const newUser = {}
    const {name, email, password} = req.body;
    if(name){
      newUser.name = name
    }
    if(email){
      newUser.email = email
    }
    if(password){
      newUser.password = password
    }
    const userId = req.user.id;
    const user = await User.findByIdAndUpdate(userId, {$set: newUser}, {new:true}).select("-password")
    res.json(user)

  } catch (error) {
    success = false
      console.error(error.message)
      res.status(500).send(success, "Oops some thing went wrong!!")
  }

})

//Rout 4:delete the user: delete "/api/auth/deleteuser" Login require
router.delete('/deleteuser', fetchuser,[
 body('password', 'Password cannot be blank').exists()],
 async(req, res)=>{
    //This will validate the entred data and respond as per the data
    //It will return bad request if there are any errors in the data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false
      return res.status(400).json({ success, errors: errors.array() });
    }

  try {
    const password = req.body.password
    const userId = req.user.id
    let user = await User.findById(userId)
      if(!user){
        success = false
        return res.status(400).json({success, error: "Please Try to enter correct password!"})
      }
      const passCompair = bcrypt.compare(password, user.password)
      if(!passCompair){
        success = false
        return res.status(400).json({success, error: "Please Try to login with correct credentials!"})
      }
  //Delete the post
  user = await User.findByIdAndDelete(req.user.id);
  res.json("User has been deleted");
  } catch (error) {
      console.error(error.message)
      res.status(500).send("Oops some thing went wrong!!")
  }
})


module.exports = router;