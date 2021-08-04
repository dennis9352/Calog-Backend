import express from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from'../models/users.js'
import { isAuth } from '../middlewares/auth.js';
import { checkPermission } from "../middlewares/checkPermission.js";
import { body } from 'express-validator';
import { validate } from '../middlewares/validator.js';
import dotenv from 'dotenv'
// import { DataExchange } from "aws-sdk";
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

const validatedupnickname = [
    body('nickname').notEmpty().withMessage('nickname is missing'),
  validate,
];

const validatedupemail = [
 
  body('email').isEmail().normalizeEmail().withMessage('invalid email'),
  validate,
];



router.post('/duplicate-email',validatedupemail, async (req, res) => {
    const { email } = await req.body;
    const found_email = await User.findOne({email:email});
    
    if (found_email) {
      return res.status(409).json({ message: `${email} already exists` });
    }

    res.status(201).json({ "result":'success' });

})

router.post('/duplicate-nickname',validatedupnickname, async (req, res) => {
  const { nickname } = await req.body;
 
  const found_nickname = await User.findOne({nickname:nickname});
 
 if (found_nickname) {
   return res.status(409).json({ message: `${nickname} already exists` });
 }

 res.status(201).json({ "result":'success' });

})


router.post('/register',validateRegister, async (req, res) => {
  try{
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
    await User.create(userInfo, function(err, user){
      if(err) return res.status(400).json(err);
      res.status(201).json({ result:'success' });
    });
  }catch(err){
    console.log(err)
    res.status(400).send({
      "errorMessage" : "등록 실패"
    })
  }
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email : email});
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
  
  router.get('/me',checkPermission, async (req, res) => {
    res.send({ user: res.locals.user });
  });
// router.post('/login', validateCredential, authController.login);

// router.get('/me', isAuth, authController.me)



//바디스펙 기록
router.post('/bodySpec', isAuth, async(req, res) => { //isAuth
  try{
  const {user} = res.locals;
  const userId = user._id;
  
  const {gender, weight, height, age} = req.body;
  
  const targetUser = await User.findOne({_id:userId})
  
  const date = new Date()
  const ryear = date.getFullYear();
  const rmonth = date.getMonth() + 1;
  const rdate = date.getDate();

  const registerDate = `${ryear}-${rmonth >= 10 ? rmonth : '0' + rmonth}-${rdate >= 10 ? rdate : '0' + rdate}`;
  
  targetUser.gender = gender;
  targetUser.weight = Number(weight);
  targetUser.height = Number(height);
  targetUser.age = Number(age);

  if(gender === '남자'){
    const bmr = 66.47 + ( 13.75 * weight + (5 * height) - (6.76 * age))
    targetUser.bmr = {
      bmr: Number(Math.round(bmr)),
      date: registerDate,
    }
  }else{
    const bmr = 655.1 + ( 9.56 * weight + (1.85 * height) - (4.68 * age))
    targetUser.bmr = {
      bmr: Number(Math.round(bmr)),
      date: registerDate,
    }
  }
  targetUser.save()
  
  res.sendStatus(200)

  }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": "바디스펙 입력중 에러발생"
    })
    return;
  }
  

})

//바디스펙 수정

router.put('/bodySpec/edit', isAuth, async(req, res) => {
  try{
    const {user} = res.locals;
    const userId = user._id;
    const {gender, weight, height, age} = req.body;
    await User.updateOne({_id:userId},{$set: {gender:gender, weight: weight, height: height, age: age}})  
    
    const editUser = await User.findOne({_id: userId})
  
    
    const date = new Date()
    const ryear = date.getFullYear();
    const rmonth = date.getMonth() + 1;
    const rdate = date.getDate();
    const registerDate = `${ryear}-${rmonth >= 10 ? rmonth : '0' + rmonth}-${rdate >= 10 ? rdate : '0' + rdate}`;


    if(gender === '남자'){
      const bmr = 66.47 + ( 13.75 * weight + (5 * height) - (6.76 * age))
      if(editUser.bmr[editUser.bmr.length -1].date === registerDate){
        editUser.bmr[editUser.bmr.length -1].bmr = Number(Math.round(bmr))
        
        console.log(bmr)
        console.log(editUser)
        
        editUser.save()
      }else{
        editUser.bmr.push({bmr: Number(Math.round(bmr)), date: registerDate})
        editUser.save()
      }
      
    }else{  //여자일때
      const editUser = await User.findOne({_id: userId})
      const bmr = 655.1 + ( 9.56 * weight + (1.85 * height) - (4.68 * age))
      if(editUser.bmr[editUser.bmr.length -1].date === registerDate){
        editUser.bmr[editUser.bmr.length -1].bmr = Number(Math.round(bmr))
        editUser.save()
      }else{
        editUser.bmr.push({bmr: Number(Math.round(bmr)), date: registerDate})
        editUser.save()
      }
      
    }
    res.sendStatus(200);

  

  }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": "바디스펙 수정중 에러발생"
    })
    return;
  }
})




export default router;