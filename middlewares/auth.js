import jwt from "jsonwebtoken";
import User from "../models/users.js";
import dotenv from "dotenv";
dotenv.config();
const AUTH_ERROR = { message: "Authentication Error" };
//로그인 확인 미들웨어
export const isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!(authHeader && authHeader.startsWith("Bearer "))) {//Bearer타입인지 확인, 해당 타입이 아닌경우 에러메세지 반환
    return res.status(401).json(AUTH_ERROR);
  }

  const token = authHeader.split(" ")[1];//헤더에 들어있는 토큰을 받음

  jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {//유효한 토큰인지 확인 후 유효하지 않은 경우 에러메세제를 반환한다
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }

    const user = await User.findOne({ _id: decoded.id });
    if (!user) {//jwt토큰에 저장된 유저 아이디가 실제로 존제하는 아이디인지 확인후 존제하지 않는 경우 에러메세지 반환
      return res.status(401).json(AUTH_ERROR);
    }

    res.locals.user = user;//위의 모든 로직을 통과하면 res.locals에 유저정보를 저장 후 미들웨어 통과
    next();
  });
};
