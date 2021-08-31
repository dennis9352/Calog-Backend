import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import passport from "../passport/GoogleStrategy.js";
dotenv.config();

const router = express.Router();

// jwt 시크릿키 및 만료일 설정
const jwtSecretKey = process.env.JWT_SECRET;
const jwtExpiresInDays = "2d";

// 첫번째 코드 - 구글 로그인하기, passport/GoogleStrategy 실행
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// 두번째 코드 - callback URL(passport의 GoogleStrategy실행 후 실행 )
router.get(
  "/oauth",
  passport.authenticate("google", {
    failureRedirect: "/",//로그인 실패시 리다이렉 주소
  }),
  (req, res) => {
    try {
      const token = createJwtToken(req.user._id);//jwt 토큰 생성
      res.status(200).redirect("https://www.calog.app/google?token=" + token);
    } catch (err) {
      console.log(err)
      res
        .status(400)
        .send({ errorMessage: "로그인 실행중 에러가 발생 하였습니다" });
    }
  }
);
//jwt토큰 생성 함수
function createJwtToken(id) {
  return jwt.sign({ id }, jwtSecretKey, { expiresIn: jwtExpiresInDays });
}

export default router;
