import express from "express";
// import User from '../models/user.js'
import Favorite from '../models/favorite.js'
// import food from "../models/food.js";

const router = express.Router();

router.post('/add',authMiddleware, async(req, res)=>{
    const {foodId} = req.body;
    const {user} = res.locals;
    const userId = user.userId

    const existUser = await Favorite.find({userId : userId})
    if(!existUser){
        await Favorite.create({userId : userId, foodId : foodId})
    }else{
        existUser.foodId.push(foodId)
    }

    
})
