import express from "express";
import User from "../models/users.js"
import FoodRecord from '../models/foodRecord.js'
import Record from '../models/record.js'
import { checkPermission } from "../middlewares/checkPermission.js";
import moment from "moment"
import "moment-timezone"
import { isAuth } from "../middlewares/auth.js";
const router = express.Router();

router.post('/',checkPermission, async (req,res) => {
    let { date, foodList, type } = req.body

    const newdate = moment()
    const todayDate = newdate.format("YYYY-MM-DD")
    const year = date.split("-")[0]
    const month = date.split("-")[1]
    moment.tz.setDefault("Asia/Seoul");

    const userId = res.locals.user._id
    const user = await User.findById(userId).exec()
    const record = await Record.findOne({userId: userId, date: date}).exec()
    let bmr = user.bmr[user.bmr.length-1].bmr
    try{
      if(!record) {   // 해당 날짜 하루 칼로리 기록이 없을때 (생성) 
        if(date !== todayDate){               // 기록하려는 날짜가 오늘 날짜가 아니면
            if(user.bmr[0].date < date){      // 기초대사량 첫번째 기록이 작성하려는 날짜전의 기록있다면 
            for(let i in user.bmr){           
              if(user.bmr[i].date < date){    // 작성하려는 날짜 전의 기초대사량 기록날짜중 가장 근접한 날짜의 기초대사량이 베이스가 된다.
                 bmr = user.bmr[i].bmr
              }
            }
            }else{                            // 작성하려는 날짜 전의 기초대사량 기록이 없다면 후에 작성한 날짜중 가장 최근 날짜의 기초대사량이 베이스가 된다.
              bmr = user.bmr[0].bmr
            }
          }

          const newRecord = new Record({
            userId : userId,
            date : date,
            year : year,
            month : month,
            bmr: bmr,
          })

          for(let i in foodList){               //먹은 음식 하나씩 저장
            let resultKcal = Math.round(foodList[i].kcal * foodList[i].amount)
          
            let foodRecord = await FoodRecord.create({
                foodId : foodList[i].foodId,
                name : foodList[i].name,
                kcal: foodList[i].kcal,
                amount : foodList[i].amount,
                resultKcal : resultKcal,
                forOne : foodList[i].forOne,
                measurement: foodList[i].measurement,
                type: type,
                date: date,
                userId: userId
            })
                newRecord.foodRecords.push(foodRecord._id);     //먹은 음식들 기록에 저장
                newRecord.totalCalories =+ resultKcal

            }
            
            await newRecord.save()

            res.sendStatus(200)
      }else{              // 해당 날짜 하루 칼로리 기록이 이미 있을때 (추가)
        
        if (record.bmr !== bmr && date === todayDate){    //기록의 기초대사량이 지금 기초대사량이랑 다르고 날짜가 오늘 날짜이면 변경
          record.bmr = bmr;
        }
        
        for(let i in foodList){
          let resultKcal = Math.round(foodList[i].kcal * foodList[i].amount)
          
          let foodRecord = await FoodRecord.create({
              foodId : foodList[i].foodId,
              name : foodList[i].name,
              kcal: foodList[i].kcal,
              amount : foodList[i].amount,
              resultKcal : resultKcal,
              forOne : foodList[i].forOne,
              measurement: foodList[i].measurement,
              type: type,
              date: date,
              userId: userId
          })
            record.foodRecords.push(foodRecord._id);
            record.totalCalories += resultKcal
        }

        await record.save()

        res.sendStatus(200)
    } 
    }catch(err){
        console.log(err)
        res.status(400).send({
            errorMessage: "Record 등록에 실패했습니다."
        })
    }
});

router.put('/:recordId',isAuth, async(req,res) => {
    const { recordId } = req.params
    const { foodList, type, date, typeCalories } = req.body
    const userId = res.locals.user._id
    const record = await Record.findById(recordId).exec()
    const user = await User.findById(userId)
    
    try{
      record.totalCalories -= typeCalories
      record.foodRecords = []
      // 해당 type 칼로리 기록 업데이트
      for(let i in foodList){
        let resultKcal = Math.round(foodList[i].kcal * foodList[i].amount)
        let foodRecord = await FoodRecord.create({
              foodId : foodList[i].foodId,
              name : foodList[i].name,
              kcal: foodList[i].kcal,
              amount : foodList[i].amount,
              resultKcal : foodList[i].resultKcal,
              forOne : foodList[i].forOne,
              measurement: foodList[i].measurement,
              type: type,
              date: date,
              userId: userId
        })
          record.foodRecords.push(foodRecord._id);
          record.totalCalories += resultKcal
      }

    await record.save()

    //만약 기록에 칼로리 기록이 없다면 삭제
    if (!record.foodRecords.length){
      await Record.findByIdAndDelete(recordId)
    }
    await user.save()

    res.sendStatus(200)

  }catch(err){
    console.log(err)
    res.status(400).send({
      errorMessage: "식단 수정에 실패했습니다"
    })
  }
})

router.post('/:recordId/url', isAuth, async(req, res) => {
  const { recordId } = req.params
  const { url, type } = req.body

  const record = await Record.findById(recordId)
  try{
  for(let i in url){
    let typeUrl = {
      url : url[i],
      type : type,
    }
    record.url.push(typeUrl)
  }
  await record.save()
  res.sendStatus(200)
  }catch(err){
    console.log(err)
    res.status(400).send({
      errorMessage:"사진등록에 실패했습니다"
    })
  }
})

router.delete('/:recordId/url', isAuth, async(req, res) => {
  const { recordId } = req.params
  const { type } = req.body
  const record = await Record.findById(recordId)
  try{
  for(let i=record.url.length -1; i >= 0; i--){
    if(record.url[i].type === type){
      record.url.splice(i,1)
    }
  }
  await record.save()
  res.sendStatus(200)
  }catch(err){
    console.log(err)
    res.status(400).send({
      errorMessage:"사진삭제에 실패했습니다"
    })
  }
})

router.post('/:recordId/contents', isAuth, async(req, res) => {
  const { recordId } = req.params
  const { contents, type } = req.body

  const record = await Record.findById(recordId)
  try{
  for(let i in contents){
    let typeContents = {
      contents : contents[i],
      type : type,
    }
    record.contents.push(typeContents)
  }
  await record.save()
  res.sendStatus(200)
  }catch(err){
    console.log(err)
    res.status(400).send({
      errorMessage:"메모등록에 실패했습니다"
    })
  }
})

router.delete('/:recordId/contents', isAuth, async(req, res) => {
  const { recordId } = req.params
  const { type } = req.body
  const record = await Record.findById(recordId)
  try{
  for(let i=record.contents.length -1; i >= 0; i--){
    if(record.contents[i].type === type){
      record.contents.splice(i,1)
    }
  }
  await record.save()
  res.sendStatus(200)
  }catch(err){
    console.log(err)
    res.status(400).send({
      errorMessage:"메모삭제에 실패했습니다"
    })
  }
})

export default router;