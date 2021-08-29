import express from "express";
import Food from '../models/food.js';
import Favorite from '../models/favorite.js'
import MostUsed from '../models/mostUsed.js';
import {checkPermission} from '../middlewares/checkPermission.js'
import Recent from '../models/recent.js'
import {isAuth} from '../middlewares/auth.js'
import Recommend from '../models/recommend.js'
const router = express.Router();


//검색 API

router.get("/search/:keyword", checkPermission, async (req, res) => {
  try{    
      const keyword = decodeURIComponent(req.params.keyword);
      const nameKey = String(keyword) //키워드 값을 스트링을 감싸줘야 쿼리에 변수로서 적용가능
      const {user} = res.locals  // 로그인한 유저와  로그인 안한 유저 둘다 검색 가능, 로그인 되어있으면 user 선언
      const food = await Food.aggregate(
        [
          {
            '$search': {
              'index': 'haha',
              'text': {
                'query': nameKey, 
                'path': 'name' 
              }
            }
          }, {
            '$project': {
              'name': 1, 
              'kcal': 1, 
              'forOne': 1,
              'measurement':1,
              'score': {
                '$meta': 'searchScore'
              }
            }
          },{
            '$limit' : 1000
          }
        ]
      )  

      //food는 list 형태
    
      if (!user){  //로그인 안했으면 일반적인 검색창, 즐겨찾기 반영안됨.        
        for(let i = 0; i<food.length; i++){
        
          const foodId = food[i]['_id']
          food[i].foodId = foodId
        }
               
        if(food.length ===0){
          res.sendStatus(204)   // 검색결과 없음.
          return;
        }else{
          res.json({food})  //문제 없을 시 food 내려줌.
          
        }
      
       
      }else if(user){ //로그인했을때(즐겨찾기 있는 경우와 없는 경우로 나뉨)
        const userId = user._id
        const favoriteFood = await Favorite.findOne({userId:userId}) //로그인 했으면 Favorite db collection에서 userId에 속해있는 foodId(즐겨찾기목록) 가져옴. 
        
        if(!favoriteFood){   //로그인한 유저가 즐겨찾기한 음식이 없을 경우
          
          for(let i = 0; i < food.length; i++){
            const foodId = food[i]._id
            food[i].foodId = foodId
        }
          if(food.length ===0){
            res.sendStatus(204)   // 검색결과 없음.
            return;
          }else{
            res.json({food})
          }
        }else if(favoriteFood){  //로그인한 유저가 즐겨찾기 목록이 있을경우
          const favoriteList = favoriteFood.foodId //[foodId1, foodId2...]
        
          for(let i = 0; i < food.length; i++){
            if(favoriteList.includes(food[i]['_id'])){
              const foodId = food[i]._id
              food[i].foodId = foodId
              food[i].isLike = true //favoriteList(즐겨찾기 목록)에 전체 검색결과에서의 foodId가 들어있으면 isLike: true 추가
            }else{
              const foodId = food[i]._id
              food[i].foodId = foodId
            }
          }
          
          if(food.length ===0){
            res.sendStatus(204)   // 검색결과 없음.
            return;
          }else{
            res.json({food}) //문제 없을 시 foodList 값 내려줌.
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
    const mostUsedKey = await MostUsed.find({}).sort("-times").limit(10);
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
    const {user} = res.locals;
    const userId = user._id
    const {keyword} = req.body;
    const recentKey = await Recent.findOne({userId:userId})
    if (!recentKey){ //리스트가 없을때
      await Recent.create({userId: userId, keyword:[keyword]})
    }else{  //리스트가 있을때
      
      if(recentKey.keyword.length <10){  //배열이 10개 미만일때
        if(recentKey.keyword.includes(keyword)){ //키워드가 이미 리스트에 존재할때
          recentKey.keyword.remove(keyword)
          recentKey.keyword.push(keyword)
          recentKey.save()
        }else{ //키워드가 리스트에 존재하지 않을때
          recentKey.keyword.push(keyword)
          recentKey.save()
        }
        
      }else{  // 배열이 10개 이상일때
        if(recentKey.keyword.includes(keyword)){//키워드가 이미 리스트에 존재할때
          recentKey.keyword.remove(keyword)
          const lastKey = recentKey.keyword[0]
          recentKey.keyword.remove(lastKey)
          recentKey.keyword.push(keyword)
          recentKey.save()
        }else{ //키워드가 리스트에 존재하지 않을때
          const lastKey = recentKey.keyword[0]
          recentKey.keyword.remove(lastKey)
          recentKey.keyword.push(keyword)
          recentKey.save()
        }
        
      }
      
    }
    
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
router.get('/recentkey', isAuth, async(req, res) =>{
  try{
    const {user} = res.locals;
    const userId = user._id

    const recentKey = await Recent.findOne({userId:userId})
    if(!recentKey){
      res.sendStatus(204)
      return;
    }else{
      const keywordList = recentKey.keyword.reverse()
      res.send(keywordList)
    }
    
    
  }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": "최근 검색어 등록중 에러발생"
    })
    return;
  }
 
})

//최근 검색어 삭제 API
router.delete('/recentkey', isAuth, async(req, res) =>{
  try{
    const {user} = res.locals;
    const userId = user._id
    const {keyword} = req.body;
    
    const recentKey = await Recent.findOne({userId:userId})
    recentKey.keyword.remove(keyword)
    recentKey.save()
    res.sendStatus(200);
    
  }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": "최근 검색어 삭제중 에러발생"
    })
    return;
  }
 
})

//추천 검색어 API

router.get('/recommend', async(req, res) => {
  try{
    const randomList = []
    for (let i = 0; i < 10; i++){
      const randomCount = await Recommend.count()
      const randomKey = Math.floor(Math.random() * randomCount); //나중에 변경
      const randomKeyword = await Recommend.findOne().skip(randomKey).limit(1);
      randomList.push(randomKeyword)
    }
    
    res.json({randomList})
  }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": "추천 검색어 조회중 에러발생"
    })
    return;
  }
  
  
})

//데이터 추가 API

router.post('/addData', async(req, res) => {
  try{
  let {name, forOne, kcal, measurement, protein, fat, carbo, sugars, natrium, cholesterol, fattyAcid, transFattyAcid, unFattyAcid  } = req.body;
  
  await Food.create({
    name:name,
    forOne:forOne,
    kcal: kcal,
    measurement:measurement,
    protein:protein,
    fat:fat,
    carbo:carbo,
    sugars:sugars,
    natrium:natrium,
    cholesterol:cholesterol,
    fattyAcid:fattyAcid,
    transFattyAcid:transFattyAcid,
    unFattyAcid:unFattyAcid
  })

  res.sendStatus(200);
  
  }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": "데이터 추가중 에러발생"
    })
    return;
  }
})