import express from "express";
// import User from '../models/user.js'
import Favorite from '../models/favorite.js'
import Food from "../models/food.js";
import {isAuth} from '../middlewares/auth.js'
const router = express.Router();

//즐겨찾기 추가
router.post('/add',async(req, res)=>{  //isAuth
    try{
        const {foodId, userId} = req.body;
        // const {user} = res.locals;
        // const userId = user.userId
    
        const existUser = await Favorite.findOne({userId : userId})
        
        if(!existUser){
            await Favorite.create({userId : userId, foodId : foodId})
        }else{
            existUser.foodId.push(foodId)
            existUser.save()
        }
        res.status(200).send()
        
    }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": "즐겨찾기 추가중 에러발생"
    })
    return;
    }
    
})

//즐겨찾기 해제
router.delete('/delete',async(req, res) =>{
    try{
        const {foodId, userId} = req.body;
        // const {user} = res.locals;
        // const userId = user.userId;
        
        const existUser = await Favorite.findOne({userId : userId})
        existUser.foodId.remove(foodId)
        existUser.save()
        
        res.status(200).send()

    }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": "즐겨찾기 해제중 에러발생"
    }) 
}
})

//즐겨찾기 목록조회
router.get('/list', async(req, res)=>{
    try{
        const {userId} = req.body;
        // const {user} = res.locals;
        // const userId = user.userId;
    
        const existFood = await Favorite.findOne({userId:userId})
        let idList = existFood.foodId // [foodId1, foodId2....]
        if (!idList){
            res.sendStatus(204) //즐겨찾기에 등록된 음식 없음
        }else{
            let foodList = []
            for(let i = 0; i < idList.length; i++){
                const food = await Food.findOne({_id: idList[i]})
                foodList.push(food)
            }
            res.send(foodList);
        }

    }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": "즐겨찾기 조회중 에러발생"
    })
}
})




export default router;