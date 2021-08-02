import express from 'express';

import passport from '../passport/GoogleStrategy.js'

const router = express.Router();

// 첫번째 코드 - 구글 로그인하기
router.get('/google', passport.authenticate('google', { scope: ['profile']}));

// 두번째 코드 - callback URL
router.get('/oauth', passport.authenticate('google', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('http://localhost:3000/');
});


export default router;