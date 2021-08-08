import express from "express";
import { isAuth } from "../middlewares/auth.js";
import { checkPermission } from "../middlewares/checkPermission.js";
import Record from "../models/record.js"
import User from "../models/users.js"
import moment from "moment"
import "moment-timezone"

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
    moment.tz.setDefault("Asia/Seoul");

    let record = await Record.find(
        {
            $and : [{ userId : userId }, { date : todayDate }]
        }).populate("foodRecords").exec()
    
    if(!record.length){
        record = []
        res.json({ record })
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

router.get('/exercise', async(req, res) => {
    const exercise = await Exercise.find({}).limit(10)
    
    res.status(200).json({ exercise })
})

export default router;