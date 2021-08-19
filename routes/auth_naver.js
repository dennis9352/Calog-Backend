import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import passport from '../passport/NaverStrategy.js'
dotenv.config()

const router = express.Router();
// TODO: Make it secure!
const jwtSecretKey = process.env.JWT_SECRET;
const jwtExpiresInDays = '2d';
//네이버 로그인 하기
router.get('/naver', passport.authenticate('naver'));
//콜백 url
router.get('/oauth', passport.authenticate('naver', {
  session: false,
  failureRedirect: '/',
}),  (req, res) => {

  try{
    const token = createJwtToken(req.user._id);
    console.log("여긴 ok")
  //쿠키로 토큰 발급 후 리다이랙
  res.status(200).redirect("https://www.calog.app/naver?token="+token)
  }catch(err){
    console.log(err)
    res.status(400).send({errorMessage: "로그인 실행중 에러가 발생 하였습니다"})
  }
});
function createJwtToken(id) {
  return jwt.sign({ id }, jwtSecretKey, { expiresIn: jwtExpiresInDays });
}



export default router;