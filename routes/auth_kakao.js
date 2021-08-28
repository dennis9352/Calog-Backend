import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import passport from '../passport/KakaoStrategy.js'
dotenv.config()

const router = express.Router();


// TODO: Make it secure!
const jwtSecretKey = process.env.JWT_SECRET;
const jwtExpiresInDays = '2d';



// 첫번째 코드 - 카카오 로그인하기
router.get('/kakao', passport.authenticate('kakao'));

// 두번째 코드 - callback URL
router.get('/oauth', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {try{
  const token = createJwtToken(req.user._id);
//쿠키로 토큰 발급 후 리다이랙
res.status(200).redirect("https://www.calog.app/kakao?token="+token)
}catch(err){
  console.log(err)
  res.status(400).send({errorMessage: "로그인 실행중 에러가 발생 하였습니다"})
}
});
function createJwtToken(id) {
  return jwt.sign({ id }, jwtSecretKey, { expiresIn: jwtExpiresInDays });
}





export default router;