import express from "express";
import { isAuth } from "../middlewares/auth.js";
import { checkPermission } from "../middlewares/checkPermission.js";
import Record from "../models/record.js"
import User from "../models/users.js"
import moment from "moment"


const router = express.Router();

router.get('/dash',checkPermission, async(req, res) => {
    const checkUser = res.locals.user

    if(!checkUser){                     // 비로그인유저
        res.status(400).send({"message" : "로그인유저가 아닙니다."})
        return;
    }
    
    const userId = res.locals.user._id
    const newdate = moment()
    const todayDate = newdate.format('YYYY-MM-DD')
    console.log(todayDate)
    const user = await User.findById(userId)
    const userHeight = user.height
    const userWeight = user.weight
    
    if(!userHeight || !userWeight){
        res.status(400).send({
            "message" : "바디스펙 정보가 없습니다"
        })
        return
    }
    const record = await Record.find(
        {
            $and : [{ userId : userId }, { date : todayDate }]
        }).populate("foodRecords").exec()
    
    if(!record.length){
        res.status(400).send({
            "message" : "기록이 없습니다" 
        })
        return
    }
    res.json({record})
});

router.get('/:date', isAuth, async(req, res) => {
    const { date } = req.params;
    const year = date.split('-')[0]
    const month = date.split('-')[1]
    const userId = res.locals.user._id
    const record = await Record.find(
        {
            $and : [{ userId : userId }, { year : year }, { month : month }]
        }, 
        {
            "bmr":1, "totalCalories":1, "date": 1,
        }).exec()
    
    res.status(200).json({ record })
})

router.get('/detail/:date', isAuth, async(req, res) => {
    const { date } = req.params;
    const userId = res.locals.user._id

    const record = await Record.find(
        {
            $and : [{ userId : userId }, { date : date }]
        }).populate("foodRecords").exec()
 
    res.status(200).json({ record })
})


export default router;