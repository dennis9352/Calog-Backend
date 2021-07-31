import express from "express";
import Food from '../models/food.js';
import Favorite from '../models/favorite.js'
import levenshtein from 'fast-levenshtein';
import MostUsed from '../models/mostUsed.js';
import { isAuth } from "../middlewares/auth.js";
const router = express.Router();

//검색 API

router.get("/search/:keyword", async (req, res) => {
  try{    
      const keyword = decodeURIComponent(req.params.keyword);
      const nameKey = new RegExp(keyword) //키워드 값에 정규식 적용
      const {user} = res.locals  // 로그인한 유저와 로그인 안한 유저 둘다 검색 가능, 로그인 되어있으면 user 선언
      const userId = user.userId 

      //키워드 입력안했을때 오류
      
      if (!userId){  //로그인 안했으면 일반적인 검색창, 즐겨찾기 반영안됨.
        let food =  await Food.find({name: nameKey}).lean()
        for(let i = 0; i < food.length; i++){
          let distance = levenshtein.get(nameKey, food[i]['name']);
          food[i].distance = distance
        }
         
        if(food.length ===0){
          res.sendStatus(204)   // 검색결과 없음.
          return;
        }else{
          // res.send(food)  //문제 없을 시 foodList 값 내려줌.
          const sortingField = 'distance';
          res.send(food.sort(function(a,b){
            return a[sortingField] - b[sortingField]
          }))
        }
      
       
      }else if(userId){ 
        let food = await Food.find({name: nameKey}).lean()
        const favoriteFood = await Favorite.findOne({userId:userId}) //로그인 했으면 Favorite db collection에서 userId에 속해있는 foodId(즐겨찾기목록) 가져옴. 
        const favoriteList = favoriteFood.foodId //[foodId1, foodId2...]
        
        
        for(let i = 0; i < food.length; i++){
          if(favoriteList.includes(food[i]['_id'])){
            let distance = levenshtein.get(nameKey, food[i]['name']);
            food[i].distance = distance
            food[i].isLike = true //favoriteList(즐겨찾기 목록)에 전체 검색결과에서의 foodId가 들어있으면 isLike: true 추가
          }else{
            let distance = levenshtein.get(nameKey, food[i]['name']);
            food[i].distance = distance
          }
        }
        
        if(food.length ===0){
          res.sendStatus(204)   // 검색결과 없음.
          return;
        }else{
          // res.send(food) //문제 없을 시 foodList 값 내려줌.
          const sortingField = 'distance';
          res.send(food.sort(function(a,b){
          return a[sortingField] - b[sortingField]
        }))
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

//키워드별 조회수 기록 API

router.post('/search/mostUsed', async(req, res) => {
  try{
    const {keyword} = req.body;
    const existKeyword = await MostUsed.findOne({keyword:keyword})
    
    if (!existKeyword){
      const times = 1
      await MostUsed.create({keyword:keyword, times: times})
    
    }else{
      existKeyword.times++
      existKeyword.save()
    }
    res.sendStatus(200);



  }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": "키워드 조회수 기록중 에러발생"
    })
    return;
  }
})

//인기검색어 조회 API

router.get("/mostUsedKey", async(req,res) =>{
  try{
    const mostUsedKey = await MostUsed.find({}).sort("-times").limit(10);
    res.send({
      mostUsedKey
    })

  }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": "인기검색어 조회중 오류발생"
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