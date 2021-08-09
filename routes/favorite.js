import express from "express";
import Favorite from '../models/favorite.js'
import Food from "../models/food.js";
import {isAuth} from '../middlewares/auth.js'
const router = express.Router();

//즐겨찾기 추가
router.post('/add', isAuth, async(req, res)=>{  //isAuth
    try{
        const {foodId} = req.body;
        const {user} = res.locals;
        const userId = user._id
    
        const existUser = await Favorite.findOne({userId : userId})

        if(!existUser){  //Favorite db colleciton에 userId가 등록되어있지 않으면,
            await Favorite.create({userId : userId, foodId : foodId}) //userId와 foodId를 저장
        }else{
            existUser.foodId.push(foodId) //Favorite db colleciton에  userId가 등록되어 있으면, foodId를 array로 추가
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
router.delete('/delete', isAuth, async(req, res) =>{
    try{
        const {foodId} = req.body;
        const {user} = res.locals;
        const userId = user._id;
        
        const existUser = await Favorite.findOne({userId : userId})
        existUser.foodId.remove(foodId) //userId에 맞는 foodId 삭제
        existUser.save()
        
        res.status(200).send()

    }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": "즐겨찾기 삭제중 에러발생"
    }) 
}
})

//즐겨찾기 목록조회
router.get('/list', isAuth, async(req, res)=>{
    try{
        const {user} = res.locals;
        const userId = user._id;
        const existFood = await Favorite.findOne({userId:userId})
        
        if (!existFood){
            res.sendStatus(204) //즐겨찾기에 등록된 음식 없음
        }else{
            let idList = existFood.foodId // [foodId1, foodId2....] 즐겨찾기에 등록된 foodId 모두 조회
            let foodList = []
            for(let i = idList.length -1; i >= 0; i--){
                const food = await Food.findOne({_id: idList[i]})
                foodList.push(food)
            }
            res.json(foodList); //즐겨찾기에 등록된 음식 리스트 내려줌.
        }

    }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": "즐겨찾기 조회중 에러발생"
    })
}
})




export default router;