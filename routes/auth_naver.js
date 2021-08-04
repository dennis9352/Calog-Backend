import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import passport from '../passport/NaverStrategy.js'
dotenv.config()

const router = express.Router();
// TODO: Make it secure!
const jwtSecretKey = process.env.JWT_SECRET;
const jwtExpiresInDays = '2d';

router.get('/naver', passport.authenticate('naver'));

router.get('/oauth', passport.authenticate('naver', {
  failureRedirect: '/',
}), (req, res) => {

  const token = createJwtToken(req.user._id);
  console.log(token)

  res.status(200).send(token);
});
function createJwtToken(id) {
  return jwt.sign({ id }, jwtSecretKey, { expiresIn: jwtExpiresInDays });
}



export default router;