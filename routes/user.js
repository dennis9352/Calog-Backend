import express from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from'../models/users.js'
import { isAuth } from '../middlewares/auth.js';
import { body } from 'express-validator';
import { validate } from '../middlewares/validator.js';
import dotenv from 'dotenv'
dotenv.config()

const router = express.Router();

// TODO: Make it secure!
const jwtSecretKey = process.env.JWT_SECRET;
const jwtExpiresInDays = '2d';
const bcryptSaltRounds = 12;

const validateRegister = [
 
  body('email').isEmail().normalizeEmail().withMessage('invalid email'),
  body('password')
    .trim()
    .isLength({ min: 5 })
    .withMessage('password should be at least 5 characters'),
    body('nickname').notEmpty().withMessage('nickname is missing'),
  validate,
];


router.post('/duplicate-email', async (req, res) => {
    const { email } = await req.body;
    console.log(email)
    const found_email = await User.findOne({email:email});
    
    if (found_email) {
      return res.status(409).json({ message: `${email} already exists` });
    }

    res.status(201).json({ "result":'success' });

})

router.post('/duplicate-nickname', async (req, res) => {
  const { nickname } = await req.body;
 
  const found_nickname = await User.findOne({email:email});
 
 if (found_nickname) {
   return res.status(409).json({ message: `${nickname} already exists` });
 }

 res.status(201).json({ "result":'success' });

})


router.post('/register',validateRegister, async (req, res) => {
  // console.log(req.body)
    const {email, password, nickname} = await req.body;
   
    const found_email = await User.findOne({email:email});
    const found_nickname = await User.findOne({nickname:nickname});
    if (found_email) {
      return res.status(409).json({ message: `${email} already exists` });
    }
    if (found_nickname) {
      return res.status(409).json({ message: `${nickname} already exists` });
    }
    const hashed = await bcrypt.hash(password, bcryptSaltRounds);
    const userInfo = {
        email,
        password: hashed,
        nickname,
      }
    User.create(userInfo, function(err, user){
      if(err) return res.status(400).json(err);
      res.status(201).json({ result:'success' });
    });
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = createJwtToken(user._id);
    res.status(200).json({ token });
    })

  function createJwtToken(id) {
    return jwt.sign({ id }, jwtSecretKey, { expiresIn: jwtExpiresInDays });
  }
  
  router.get('/me',isAuth, async (req, res) => {
    const _id = req.userId
    const user = await User.findOne({_id:_id});
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  console.log(user)
  
  res.status(200).json({ 
                          "result":"success",
                          "email": user.email,
                          "nickname":user.nickname
                        });
                              })
// router.post('/login', validateCredential, authController.login);

// router.get('/me', isAuth, authController.me)




export default router;