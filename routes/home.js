import express from "express";
import Food from '../models/food.js';
import Favorite from '../models/favorite.js'
import levenshtein from 'fast-levenshtein';
import MostUsed from '../models/mostUsed.js';
import {checkPermission} from '../middlewares/checkPermission.js'
import Recent from '../models/recent.js'
import {isAuth} from '../middlewares/auth.js'
const router = express.Router();

//검색 API

router.get("/search/:keyword", checkPermission, async (req, res) => {
  try{    
      const keyword = decodeURIComponent(req.params.keyword);
      const nameKey = new RegExp(keyword) //키워드 값에 정규식 적용
      const {user} = res.locals  // 로그인한 유저와  로그인 안한 유저 둘다 검색 가능, 로그인 되어있으면 user 선언
    
      if (!user){  //로그인 안했으면 일반적인 검색창, 즐겨찾기 반영안됨.
        let food =  await Food.find({name: nameKey}).lean()
        for(let i = 0; i < food.length; i++){
          let distance = levenshtein.get(nameKey, food[i]['name']);
          const foodId = food[i]._id
          food[i].distance = distance
          food[i].foodId = foodId
        }
         
        if(food.length ===0){
          res.sendStatus(204)   // 검색결과 없음.
          return;
        }else{
          // res.send(food)  //문제 없을 시 food 내려줌.
          const sortingField = 'distance';
          res.json(food.sort(function(a,b){
            return a[sortingField] - b[sortingField]
          }))
        }
      
       
      }else if(user){ //로그인했을때(즐겨찾기 있는 경우와 없는 경우로 나뉨)
        const userId = user._id
        let food = await Food.find({name: nameKey}).lean()
        const favoriteFood = await Favorite.findOne({userId:userId}) //로그인 했으면 Favorite db collection에서 userId에 속해있는 foodId(즐겨찾기목록) 가져옴. 
        
        if(!favoriteFood){   //로그인한 유저가 즐겨찾기한 음식이 없을 경우
          let food =  await Food.find({name: nameKey}).lean()
          for(let i = 0; i < food.length; i++){
            let distance = levenshtein.get(nameKey, food[i]['name']);
            const foodId = food[i]._id
            food[i].foodId = foodId
            food[i].distance = distance
            
        }
          if(food.length ===0){
            res.sendStatus(204)   // 검색결과 없음.
            return;
          }else{
            const sortingField = 'distance';
            res.json(food.sort(function(a,b){
              return a[sortingField] - b[sortingField]
            }))
          }
        }else{  //로그인한 유저가 즐겨찾기 목록이 있을경우
          const favoriteList = favoriteFood.foodId //[foodId1, foodId2...]
        
          for(let i = 0; i < food.length; i++){
            if(favoriteList.includes(food[i]['_id'])){
              const foodId = food[i]._id
              food[i].foodId = foodId
              let distance = levenshtein.get(nameKey, food[i]['name']);
              food[i].distance = distance
              food[i].isLike = true //favoriteList(즐겨찾기 목록)에 전체 검색결과에서의 foodId가 들어있으면 isLike: true 추가
            }else{
              const foodId = food[i]._id
              food[i].foodId = foodId
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
            res.json(food.sort(function(a,b){
            return a[sortingField] - b[sortingField]
          }))
          }
  
  
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
    const mostUsedKey = await MostUsed.find({}).sort("-times").limit(4);
    res.json({
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
    
    res.json({
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


//최근 검색어 등록 API
router.post('/recentKey', isAuth, async(req, res) =>{
  try{
    const {keyword} = req.body;
    const recentKey = await Recent.find()
    const recentKeyword = recentKey[0]
    if (recentKey.length === 0){ //리스트가 없을때
      await Recent.create({keyword:[keyword]})
    }else{  //리스트가 있을때
      
      if(recentKeyword.keyword.length <10){  //배열이 10개 미만일때
        if(recentKeyword.keyword.includes(keyword)){ //키워드가 이미 리스트에 존재할때
          recentKeyword.keyword.remove(keyword)
          recentKeyword.keyword.push(keyword)
          recentKeyword.save()
        }else{ //키워드가 리스트에 존재하지 않을때
          recentKeyword.keyword.push(keyword)
          recentKeyword.save()
        }
        
      }else{  // 배열이 10개 이상일때
        if(recentKeyword.keyword.includes(keyword)){//키워드가 이미 리스트에 존재할때
          recentKeyword.keyword.remove(keyword)
          const lastKey = recentKeyword.keyword[0]
          recentKeyword.keyword.remove(lastKey)
          recentKeyword.keyword.push(keyword)
          recentKeyword.save()
        }else{ //키워드가 리스트에 존재하지 않을때
          const lastKey = recentKeyword.keyword[0]
          recentKeyword.keyword.remove(lastKey)
          recentKeyword.keyword.push(keyword)
          recentKeyword.save()
        }
        
      }
      
    }
    console.log(recentKeyword)
    
    res.sendStatus(200);
    
   

  }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": "최근 검색어 등록중 에러발생"
    })
    return;
  }
})

//최근 검색어 조회 API
router.get('/recentkey', async(req, res) =>{
  try{
    const recentKey = await Recent.find()
    const recentKeyword = recentKey[0]
    const keywordList = recentKeyword.keyword.reverse()
    res.send(keywordList)
    
  }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": "최근 검색어 등록중 에러발생"
    })
    return;
  }
 
})

router.delete('/recentkey', async(req, res) =>{
  try{
    const {keyword} = req.body;
    const recentKey = await Recent.find()
    const recentKeyword = recentKey[0]
    recentKeyword.keyword.remove(keyword)
    recentKeyword.save()
    res.sendStatus(200);
    
  }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": "최근 검색어 삭제중 에러발생"
    })
    return;
  }
 
})