import jwt, { decode } from 'jsonwebtoken';
import User from'../models/users.js'
import dotenv from 'dotenv'
dotenv.config()
const AUTH_ERROR = { message: 'Authentication Error' };

export const isAuth = async (req, res, next) => {

  const authHeader = req.get('Authorization');
  if (!(authHeader && authHeader.startsWith('Bearer '))) {

    return res.status(401).json(AUTH_ERROR);
  }

  const token = authHeader.split(' ')[1];
  // TODO: Make it secure!
  jwt.verify(
    token,
    process.env.JWT_SECRET,
    async (error, decoded) => {
      if (error) {
        return res.status(401).json(AUTH_ERROR);
      }
     

      const user = await User.findOne({"_id": decoded.id});
      if (!user) {
        return res.status(401).json(AUTH_ERROR);
      }
      
      
      res.locals.user = user;
      next();
    }
  );
};