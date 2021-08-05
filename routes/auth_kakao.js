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
}), (req, res) => {

  const token = createJwtToken(req.user._id);
  res.cookie("x_auth",token)
    .status(200)
    .redirect("http://localhost:3000")
});
function createJwtToken(id) {
  return jwt.sign({ id }, jwtSecretKey, { expiresIn: jwtExpiresInDays });
}





export default router;