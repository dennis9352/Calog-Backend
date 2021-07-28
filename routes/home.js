import { DataBrew } from "aws-sdk";
import express from "express";
import Food from 'food.js'

const router = express.Router();

//검색 API

router.get("/search/:keyword", async (req, res) => {
  try{
    const {keyword} = req.params;
    const {category} = req.body;
    if (category == 'food'){
      const foodName = new RegExp(keyword)
      const search =  await Food.find({$name : foodName},{score: {$meta: "textScore"}})
    }else if(category == 'exercise'){
      
    }else{
      res.status(400).send({
        "errorMessage": '카테고리를 선택해주세요.'
      })
    }

  }catch(err){
    console.log(err) 
    res.status(400).send({
      "errorMessage": `${err} : 검색중 에러발생`
    })

  }
    
    
})

//검색결과 상세페이지(음식) API

//검색결과 상세페이지(운동) API








export default router;