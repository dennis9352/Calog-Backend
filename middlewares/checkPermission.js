import jwt, { decode } from 'jsonwebtoken';
import User from'../models/users.js'
import dotenv from 'dotenv'
dotenv.config()

export const checkPermission = async (req, res, next) => {
    const authHeader = req.get('Authorization');
  
    const token = authHeader.split(' ')[1];
    // TODO: Make it secure!
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      async (error, decoded) => {
        if (error) {
          next()
        }
        console.log(decoded.id)
  
        const user = await User.findOne({"_id": decoded.id});
        if (!user) {
          next()
        }
        
        console.log(user)
        res.locals.user = user;
        next();
      }
    );
  };