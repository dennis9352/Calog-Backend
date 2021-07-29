import express from "express";
import User from '../models/user.js'

const router = express.Router();

router.post('/favorite/add',authMiddleware, async(req, res)=>{
    const {foodId, is_like} = req.body;
    const {user} = res.locals;
    const userId = user.userId

    await User.create({foodFavorites: [foodId, is_like ]})
})
