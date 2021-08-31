import jwt from "jsonwebtoken";
import User from "../models/users.js";
import dotenv from "dotenv";
dotenv.config();
//isAuth 미들웨어와 로직이 매우 유사(차이점 => 해당 미들웨어는 로그인 유저의 경우 res.locals에 유저정보를 포함하여 통과 시키고, 비로그인 유저의 경우 그냥 통과 시킨다) 
export const checkPermission = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!(authHeader && authHeader.startsWith("Bearer "))) {
    return next();
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return next();
  }

  
  jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
    if (error) {
      return next();
    }

    if (!decoded) {
      return next();
    }

    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(401).json({ message: "CheckPermission Error2" });
    }

    res.locals.user = user;
    return next();
  });
};
