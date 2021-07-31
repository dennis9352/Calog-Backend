import express from "express";
import Food from '../models/food.js';
import Favorite from '../models/favorite.js'
const router = express.Router();

//검색 API

router.get("/search/:keyword", async (req, res) => {
  try{    
      const keyword = decodeURIComponent(req.params.keyword);
      const nameKey = new RegExp(keyword)
     
      let food = await Food.find({$text: {$search: nameKey}},
        { score: {$meta: "textScore"}}).sort({score:{$meta: "textScore"}})
      console.log(food)
      let foodList = []
      for(let i = 0; i < food.length; i++){
        foodList.push(food[i])
      }
      
       
      }
      if(userId){ 
        let food = await Food.find({$text: {$search: nameKey}},
          { score: {$meta: "textScore"}}).sort({score:{$meta: "textScore"}})
        const favoriteFood = await Favorite.findOne({userId:userId}) //로그인 했으면 Favorite db collection에서 userId에 속해있는 foodId(즐겨찾기목록) 가져옴. 
        const favoriteList = favoriteFood.foodId //[foodId1, foodId2...]
        
        let foodList = []
        for(let i = 0; i < food.length; i++){
          if(favoriteList.includes(food[i]['_id'])){
            food[i].isLike = 'true' //favoriteList(즐겨찾기 목록)에 전체 검색결과에서의 foodId가 들어있으면 isLike: true 추가
            foodList.push(food[i])
          }else{
            foodList.push(food[i])
          }
        }
        
        if(foodList.length ===0){
          res.sendStatus(204)   // 검색결과 없음.
          return;
        }else{
          res.send(foodList) //문제 없을 시 foodList 값 내려줌.
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
    const foodDetail = await Food.findOne({_id : foodId}); //params로 foodId를 받아 Food db collection에서 조회 
    
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