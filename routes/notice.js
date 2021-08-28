import express from "express";
import Notice from '../models/notice.js'
import {isAuth} from '../middlewares/auth.js'
import dotenv from 'dotenv'
import Feedback from "../models/feedback.js";
import Slack from "slack-node"
import moment from "moment"
import "moment-timezone"
dotenv.config()
const router = express.Router();

const slack = new Slack();
slack.setWebhook(process.env.SLACKWEBHOOK)
const send = async (feedbackInfo) => {
        slack.webhook(
        {
            text: `--------피드백알림--------\n닉네임: ${feedbackInfo.nickname}\n제목: ${feedbackInfo.title}\n내용: ${feedbackInfo.contents}\n전화번호: ${feedbackInfo.phoneNum}\n인스타그램: ${feedbackInfo.instagramId}\n날짜: ${feedbackInfo.date}`,
            channel: "#feedbacks",
            username: "FeedbackBot",
            icon_emoji: "slack",
        },
        (error, response) => {
            if (error) {
                console.log(error);
                return;
            }
        })
};
const sendFood = async (feedbackInfo) => {
    slack.webhook(
    {
        text: `--------음식추가요청--------\n닉네임: ${feedbackInfo.nickname}\n제목: ${feedbackInfo.title}\n내용: ${feedbackInfo.contents}\n날짜: ${feedbackInfo.date}`,
        channel: "#foodfeedbacks",
        username: "FeedbackBot",
        icon_emoji: "slack",
    },
    (error, response) => {
        if (error) {
            console.log(error);
            return;
        }
    })
};


router.post('/', isAuth, async(req, res) => {               // 공지사항 쓰기
    const {title, contents, date, password} = req.body
    const user = res.locals.user
    const adminID = process.env.ADMINID
    if(user.email !== adminID){
        res.status(400).send({
            errorMessage: "관리자 권한이 없습니다."
        })
        return
    }
    const noticePassword = process.env.NOTICEPW
    if(password !== noticePassword){
        res.status(400).send({
            errorMessage: "비밀번호가 일치하지 않습니다."
        })
        return
    }
    try{
    await Notice.create({
        title: title,
        contents: contents,
        date: date,
    })

    res.sendStatus(200)
    
    }catch(err){
    console.log(err)
    res.status(400).send({
        errorMessage: "공지사항 작성에 실패했습니다"
    })
    }
})

router.get('/', async(req, res) => {                    // 공지사항 목록
    try{
    const notice = await Notice.find({})
    res.json({notice})
    
    }catch(err){
    console.log(err)
    res.status(400).send({
        errorMessage: "공지사항 불러오기에 실패했습니다"
    })
    }
})

router.get('/:noticeId', async(req, res) => {              // 공지사항 디테일
    const { noticeId } = req.params
    try{
    const notice = await Notice.findById(noticeId)
    res.json({notice})

    }catch(err){
    console.log(err)
    res.status(400).send({
        errorMessage: "공지사항 상세정보 불러오기에 실패했습니다"
    })
    }
})

router.put('/:noticeId',isAuth, async(req, res) => {           // 공지사항 업데이트
    const { noticeId } = req.params
    const { title, contents, password } = req.body
    const user = res.locals.user
    const adminID = process.env.ADMINID
    if(user.email !== adminID){
        res.status(400).send({
            errorMessage: "관리자 권한이 없습니다."
        })
        return
    }
    const noticePassword = process.env.NOTICEPW
    if(password !== noticePassword){
        res.status(400).send({
            errorMessage: "비밀번호가 일치하지 않습니다."
        })
        return
    }
    try{
    await Notice.findByIdAndUpdate(noticeId, {
        $set: {
          title: title,
          contents: contents,
        },
      }).exec();
    res.sendStatus(200)
    
    }catch(err){
    console.log(err)
    res.status(400).send({
        errorMessage: "공지사항 수정에 실패했습니다"
    })
    }
})

router.delete('/:noticeId',isAuth, async(req, res) => {      //공지사항 삭제
    const { noticeId } = req.params
    const { password } = req.body
    const user = res.locals.user
    console.log(req.body)
    console.log(password)
    const adminID = process.env.ADMINID
    if(user.email !== adminID){
        res.status(400).send({
            errorMessage: "관리자 권한이 없습니다."
        })
        return
    }
    const noticePassword = process.env.NOTICEPW
    if(password !== noticePassword){
        res.status(400).send({
            errorMessage: "비밀번호가 일치하지 않습니다."
        })
        return
    }
    try{
    await Notice.findByIdAndDelete(noticeId)
    res.sendStatus(200)
    
    }catch(err){
    console.log(err)
    res.status(400).send({
        errorMessage: "공지사항 삭제에 실패했습니다"
    })
    }
})

router.post('/feedback',isAuth, async(req,res) => {
    const newdate = moment()
    const todayDate = newdate.format("YYYY-MM-DD HH:mm:ss")
    const userId = res.locals.user._id
    const nickname = res.locals.user.nickname
    const { title, contents, date ,phoneNum, instagramId} = req.body
    try{
    
    const feedback = await Feedback.create({
        userId : userId,
        nickname : nickname,
        title : title,
        contents : contents,
        date : date,
    })

    if(phoneNum !== undefined){
        feedback.phoneNum = phoneNum
    }
    if(instagramId !== undefined){
        feedback.instagramId = instagramId
    }
    
    await feedback.save()
    const feedbackInfo = {
        nickname: nickname,
        title: title,
        contents: contents,
        phoneNum: phoneNum,
        instagramId: instagramId,
        date: todayDate,
    }
    await send(feedbackInfo)
    
    res.sendStatus(200)

    }catch(err){
        console.log(err)
        res.status(400).send({
            errorMessage: "피드백 작성에 실패했습니다"
        })
    }
});

router.post('/feedbackFood',isAuth, async(req,res) => {
    const newdate = moment()
    const todayDate = newdate.format("YYYY-MM-DD HH:mm:ss")
    const userId = res.locals.user._id
    const nickname = res.locals.user.nickname
    const { contents, date } = req.body
    const title = "음식추가요청"
    try{

    await Feedback.create({
        userId : userId,
        nickname : nickname,
        title : title,
        contents : contents,
        date : date,
    })

    const feedbackInfo = {
        nickname: nickname,
        title: title,
        contents: contents,
        date: todayDate,
    }
    await sendFood(feedbackInfo)

    res.sendStatus(200)
    }catch(err){
        console.log(err)
        res.status(400).send({
            errorMessage: "음식추가요청에 실패했습니다"
        })
    }
});


export default router;