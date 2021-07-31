import express from "express";
import axios from "axios"
import qs from "qs"
import User from'../models/users.js'
import jwt from 'jsonwebtoken';



const router = express.Router();
const jwtSecretKey = process.env.JWT_SECRET;
const jwtExpiresInDays = '2d';

router.get('/oauth', async (req, res) =>{
    const { code }= req.query
    const apikey = process.env.k_API_KEY 
    console.log(code)
    let tokenResponse;
    try {
        const url = `https://kauth.kakao.com/oauth/token`
        tokenResponse = await axios({
          method: "POST",
          url,
          headers: {
            "content-type": "application/x-www-form-urlencoded"
          },
          data: qs.stringify({
            grant_type: "authorization_code",
            client_id: apikey,
            redirect_uri: "http://52.78.116.106/api/auth_kakao/oauth",
            code
          })
        });
    // try {
    //   const url = `https://kauth.kakao.com/oauth/token`
    //   tokenResponse = await axios({
    //     method: "POST",
    //     url,
    //     headers: {
    //       "content-type": "application/x-www-form-urlencoded"
    //     },
    //     data: qs.stringify({
    //       grant_type: "authorization_code",
    //       client_id: apikey,
    //       redirect_uri: "http://localhost:3000/api/auth_kakao/oauth",
    //       code
    //     })
    //   });
      } catch (error) {
        return res.json(error.data);
      }

      const { access_token } = tokenResponse.data;

  let userResponse;

  try {
    userResponse = await axios({
      method: "GET",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
  } catch (error) {
    return res.json(error.data);
  }

  console.log(userResponse.data.id)
    const kakao_id = userResponse.data.id
    const social = "kaako"
   

    const user = await User.findOne({kakao_id:kakao_id});
    if (user) {
      console.log(user._id)
      const token = createJwtToken(user._id)
      return res.status(201).json({ token });
    }

    const kakaoInfo = {
        social,
        kakao_id
    }

    User.create(kakaoInfo, function(err, kuser){
        if(err) return res.status(400).json(err);

        const token = createJwtToken(kuser._id)
        return res.status(201).json({ token });
        
      });

})

function createJwtToken(id) {
    return jwt.sign({ id }, jwtSecretKey, { expiresIn: jwtExpiresInDays });
  }


export default router;