import express from "express";
import Food from '../models/food.js'

const router = express.Router();

//검색 API

router.get("/search/:keyword", async (req, res) => {
  try{    
      const keyword = decodeURIComponent(req.params.keyword);
      const nameKey = new RegExp(keyword) 

      let food = await Food.find({$text: {$search: nameKey}},
        { score: {$meta: "textScore"}}).sort({socre:{$meta: "textScore"}})
      
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
    
  }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": "검색중 에러발생"
    })
    return;
  }
    
    
})

//검색결과 상세페이지(음식) API








export default router;