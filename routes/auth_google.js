import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import passport from '../passport/GoogleStrategy.js'
dotenv.config()

const router = express.Router();


// TODO: Make it secure!
const jwtSecretKey = process.env.JWT_SECRET;
const jwtExpiresInDays = '2d';
const bcryptSaltRounds = 12;


// 첫번째 코드 - 구글 로그인하기
router.get('/google', passport.authenticate('google', { scope: ['profile']}));

// 두번째 코드 - callback URL
router.get('/oauth', passport.authenticate('google', {
  failureRedirect: '/',
}), (req, res) => {

  const token = createJwtToken(req.user._id);
  //쿠키로 토큰 발급 후 리다이랙
  res.status(200).redirect("http://localhost:3000/google?token="+token)
});
function createJwtToken(id) {
  return jwt.sign({ id }, jwtSecretKey, { expiresIn: jwtExpiresInDays });
}



export default router;