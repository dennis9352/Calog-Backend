import jwt, { decode } from 'jsonwebtoken';
import User from'../models/users.js'
import dotenv from 'dotenv'
dotenv.config()

export const checkPermission = async (req, res, next) => {
    const authHeader = req.get('Authorization');

    if(!(authHeader && authHeader.startsWith('Bearer '))){

      return next();
    }
    const token = authHeader.split(' ')[1];

    if(!token){
       return next();
    }


    // TODO: Make it secure!
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      async (error, decoded) => {
        if (error) {
          return next()
        }

        if(!decoded){
          return next();
        }


        const user = await User.findOne({"_id": decoded.id});
      if (!user) {
        return res.status(401).json({message: 'CheckPermission Error2'});
      }

        res.locals.user = user;
        return next();
      }
    );
  };
