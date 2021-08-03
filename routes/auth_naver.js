import express from 'express';

import passport from '../passport/NaverStrategy.js'

const router = express.Router();

router.get('/login/naver', passport.authenticate('naver'));

router.get('/oauth', function (req, res, next) {
  passport.authenticate('naver', function (err, user) {
    console.log('passport.authenticate(naver)실행');
    if (!user) { return res.redirect('http://localhost:3000/login'); }
    req.logIn(user, function (err) { 
       console.log('naver/callback user : ', user);
       return res.redirect('http://localhost:3000/');        
    });
  })(req, res);
});

export default router;