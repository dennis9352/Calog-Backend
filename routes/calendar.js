import express from "express";
import { isAuth } from "../middlewares/auth.js";
import { checkPermission } from "../middlewares/checkPermission.js";
import Record from "../models/record.js"
import User from "../models/users.js"
import Exercise from "../models/exercise.js";
import moment from "moment"
import "moment-timezone"

const router = express.Router();

router.get('/exercise',checkPermission, async(req, res) => {
    try{
    const exercise = await Exercise.aggregate([{ $sample: { size: 5 } }])
    
    res.status(200).json({ exercise })
    
    }catch(err){
        console.log(err)
        res.status(400).send({
            errorMessage: "운동리스트 불러오기에 실패했습니다"
        })
    }
    
})

router.get('/dash',checkPermission, async(req, res) => {
    const userId = res.locals.user._id
    const newdate = moment()
    const todayDate = newdate.format('YYYY-MM-DD')
    moment.tz.setDefault("Asia/Seoul");
    
    try{
    const userInfo = await User.findById(userId)
    const blind = {
        heightBlind : userInfo.heightBlind,
        weightBlind : userInfo.weightBlind,
        bmrBlind : userInfo.bmrBlind,
    }
    let record = await Record.find({ userId : userId , date : todayDate }).populate("foodRecords").exec()
    
    if(!record.length){
        record = []
        res.json({ record, blind })
        return
    }
    res.json({record, blind})
    
    }catch(err){
        console.log(err)
        res.status(400).send({
            errorMessage: "대쉬보드 불러오기에 실패했습니다"
        })
    }
});

router.put('/blind', checkPermission, async(req, res) => {
    const { weightBlind, heightBlind, bmrBlind } = req.body
    const user = res.locals.user
    const userInfo = await User.findById(user._id)

    try{
    if(weightBlind !== undefined){
        userInfo.weightBlind = weightBlind
    }
    if(heightBlind !== undefined){
        userInfo.heightBlind = heightBlind
    }
    if(bmrBlind !== undefined){
        userInfo.bmrBlind = bmrBlind
    }   
    await userInfo.save()
    const userBlind = {
        weightBlind : userInfo.weightBlind,
        heightBlind : userInfo.heightBlind,
        bmrBlind : userInfo.bmrBlind,
    }
    res.status(200).json(userBlind)
    }catch(err){
        console.log(err)
        res.status(400).send({
            errorMessage: "블라인드 처리에 실패했습니다"
        })
    }
});

router.get('/:date', isAuth, async(req, res) => {
    const { date } = req.params;
    const year = date.split('-')[0]
    const month = date.split('-')[1]
    const userId = res.locals.user._id
    try{
    const record = await Record.find(
        {
            $and : [{ userId : userId }, { year : year }, { month : month }]
        }, 
        {
            "bmr":1, "totalCalories":1, "date": 1,
        }).exec()
    
    res.status(200).json({ record })
    
    }catch(err){
    console.log(err)
    res.status(400).send({
        errorMessage: "캘린더 불러오기에 실패했습니다"
    })
}
})

router.get('/detail/:date', isAuth, async(req, res) => {
    const { date } = req.params;
    const userId = res.locals.user._id
    try{
    const record = await Record.find({ userId : userId , date : date }).populate("foodRecords").exec()
    
    res.status(200).json( record )
    
    }catch(err){
    console.log(err)
    res.status(400).send({
        errorMessage: "상세정보 불러오기에 실패했습니다"
    })
}
})


export default router;