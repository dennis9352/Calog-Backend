import express from "express";
import User from "../models/users.js"
import FoodRecord from '../models/foodRecord.js'
import Record from '../models/record.js'
import { checkPermission } from "../middlewares/checkPermission.js";

const router = express.Router();

router.post('/',checkPermission, async (req,res) => {
    const { date, foodList, contents, url, type} = req.body
    console.log(req.body)
    
    if(!res.locals.user){                     // 비로그인유저
      res.send({"message" : "로그인유저가 아닙니다."})
      return;
    }

    const userId = res.locals.user._id
    const user = await User.findById(userId).exec()
    const record = await Record.findOne({userId: userId, date: date}).exec()
    const bmr = user.bmr
    try{
    
      if(!record) {   // 오늘 하루 칼로리 기록이 없을때 (생성)
          const newRecord = new Record({
            userId : userId,
            date : date,
            contents: contents,
            bmr: bmr,
            url: url,
          })

          for(let i in foodList){               //먹은 음식 하나씩 저장
              let foodId = foodList[i].foodId
              let name = foodList[i].name
              let amount = foodList[i].amount
              let kcal = foodList[i].kcal
              let resultKcal = (kcal * amount)

              let foodRecord = await FoodRecord.create({
                  foodId : foodId,
                  name : name,
                  amount : amount,
                  resultKcal : resultKcal,
                  type: type,
              })
                newRecord.foodRecords.push(foodRecord._id);     //먹은 음식들 기록에 저장
            }

            await newRecord.save(async function () {
              try {
                
                user.records.push(newRecord._id);   //해당 유저에 기록 저장
                await user.save();
              } catch (err) {
                console.log(err);
              }
            });
            res.sendStatus(200)
    }else{              // 오늘 하루 칼로리 기록이 이미 있을때 (추가)

        if (record.bmr !== bmr){
          record.bmr = bmr;
        }
        for(let i in foodList){
          let foodId = foodList[i].foodId
          let name = foodList[i].name
          let amount = foodList[i].amount
          let kcal = foodList[i].kcal
          let resultKcal = (kcal * amount)

          let foodRecord = await FoodRecord.create({
              foodId : foodId,
              name : name,
              amount : amount,
              resultKcal : resultKcal,
              type: type,
          })
            record.foodRecords.push(foodRecord._id);
        }
        if(!url.length){
        const oldUrl = record.url
        const newUrl = oldUrl.concat(url)
        record.url = newUrl
        }
        await record.save()

        res.sendStatus(200)
    }
    }catch(err){
        console.log(err)
        res.status(400).send({
            errorMessage: "등록에 실패했습니다."
        })
    }
});

router.put('/:recordId', async(req,res) => {
    const { recordId } = req.params;
    const { foodList, contents, url, type } = req.body
    // const userId = req.user.userId
    
    const record = await Record.findById(recordId)
    for(let i in record.foodRecords){                 //foodRecord에 있는 기록 삭제하기
        await FoodRecord.findByIdAndDelete(record.foodRecords[i])
    }
    
    record.contents = contents
    record.url = url
    record.foodRecords = []                         //user record에 연결되어있는 foodRecords 비우고 다시 넣기
    
    for(let i in foodList){
      let foodId = foodList[i].foodId
      let name = foodList[i].name
      let amount = foodList[i].amount
      let kcal = foodList[i].kcal
      let resultKcal = (kcal * amount)

      let foodRecord = await FoodRecord.create({
          foodId : foodId,
          name : name,
          amount : amount,
          resultKcal : resultKcal,
          type: type,
      })
        record.foodRecords.push(foodRecord._id);
    }

    await record.save()   
    res.sendStatus(200)
})

router.delete('/:recordId', async(req,res) => {
    const { recordId } = req.params;
    
    Record.findByIdandDelete(recordId);
    res.sendStatus(200)
})




export default router;