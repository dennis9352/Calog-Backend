import express from "express";
import Food from '../models/food.js';
import Favorite from '../models/favorite.js'
const router = express.Router();

//검색 API

router.get("/search/:keyword", async (req, res) => {
  try{    
      const keyword = decodeURIComponent(req.params.keyword);
      const nameKey = new RegExp(keyword)
      const {userId} = req.body;
      // const {user} = res.locals
      // const userId = user.userId

      //키워드 입력안했을때 오류
      
      if (!userId){
        let food = await Food.find({$text: {$search: nameKey}},
          { score: {$meta: "textScore"}}).sort({score:{$meta: "textScore"}})
          console.log(food)
        let foodList = []
        for(let i = 0; i < food.length; i++){
          foodList.push(food[i])
        }
        
        if(foodList.length ===0){
          res.sendStatus(204)   // 검색결과 없음.
          return;
        }else{
          res.send(foodList)
        }
      
       
      }else if(userId){
        let food = await Food.find({$text: {$search: nameKey}},
          { score: {$meta: "textScore"}}).sort({score:{$meta: "textScore"}})
        const favoriteFood = await Favorite.findOne({userId:userId})
        const favoriteList = favoriteFood.foodId //[foodId1, foodId2...]
        
        let foodList = []
        for(let i = 0; i < food.length; i++){
          if(favoriteList.includes(food[i]['_id'])){
            food[i].isLike = 'true'
            foodList.push(food[i])
          }else{
            foodList.push(food[i])
          }
        }
        
        if(foodList.length ===0){
          res.sendStatus(204)   // 검색결과 없음.
          return;
        }else{
          res.send(foodList)
        }

      }

  }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": "검색중 에러발생"
    })
    return;
  }
    
    
})

//검색결과 상세페이지(음식) API

router.get("/search/detail/:foodId", async (req, res) => {
  try{
    const {foodId} = req.params
    const foodDetail = await Food.findOne({_id : foodId});
    
    //isLike 값 끌고오기?
    res.send({
      foodDetail
    })
   
  }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": "상세보기 조회중 에러발생"
    })
    return;
  }
  
  
})








export default router;