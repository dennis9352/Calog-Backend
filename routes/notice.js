import express from "express";
import Notice from '../models/notice.js'
import {isAuth} from '../middlewares/auth.js'
import dotenv from 'dotenv'
dotenv.config()
const router = express.Router();

router.post('/', isAuth, async(req, res) => {               // 공지사항 쓰기
    const {title, contents, date, password} = req.body
    const user = res.locals.user
    const adminID = process.env.ADMINID
    if(user.email === adminID){
        res.status(400).send({
            errorMessage: "관리자 권한이 없습니다."
        })
    }
    const noticePassword = process.env.NOTICEPW
    if(password === noticePassword){
        res.status(400).send({
            errorMessage: "비밀번호가 일치하지 않습니다."
        })
    }
    await Notice.create({
        title: title,
        contents: contents,
        date: date,
    })

    res.sendStatus(200)
})

router.get('/', async(req, res) => {                    // 공지사항 목록
    const notice = await Notice.find({})
    res.json({notice})
})

router.get('/:noticeId', async(req, res) => {              // 공지사항 디테일
    const noticeId = req.params
    const notice = await Notice.findById(noticeId)
    res.json({notice})
})

router.put('/:noticeId',isAuth, async(req, res) => {           // 공지사항 업데이트
    const noticeId = req.params
    const {title, contents, password} = req.body
    const user = res.locals.user
    const adminID = process.env.ADMINID
    if(user.email === adminID){
        res.status(400).send({
            errorMessage: "관리자 권한이 없습니다."
        })
    }
    const noticePassword = process.env.NOTICEPW
    if(password === noticePassword){
        res.status(400).send({
            errorMessage: "비밀번호가 일치하지 않습니다."
        })
    }
    await Notice.findOneAndUpdate(noticeId, {
        $set: {
          title: title,
          contents: contents,
        },
      }).exec();
    res.sendStatus(200)
})

router.delete('/:noticeId',isAuth, async(req, res) => {      //공지사항 삭제
    const noticeId = req.params
    const {password} = req.body
    const user = res.locals.user
    
    const adminID = process.env.ADMINID
    if(user.email === adminID){
        res.status(400).send({
            errorMessage: "관리자 권한이 없습니다."
        })
    }
    const noticePassword = process.env.NOTICEPW
    if(password === noticePassword){
        res.status(400).send({
            errorMessage: "비밀번호가 일치하지 않습니다."
        })
    }
    await Notice.findByIdAndDelete(noticeId)
    res.sendStatus(200)
})



export default router;