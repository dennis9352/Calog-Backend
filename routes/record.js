import express from "express";
import User from "../models/users.js"
import FoodRecord from '../models/foodRecord.js'
import Record from '../models/record.js'

const router = express.Router();

router.post('/', async (req,res) => {
    const { date, foodList, content, url, userId, type} = req.body
    const user = await User.findById(userId).exec()
    
    const record = await Record.find({userId: userId, date: date}).exec()
    
    console.log(user.bmr)
    try{
    
      if(!record.length) {   // 오늘 하루 칼로리 기록이 없을때 (생성)
        const newRecord = new Record({
            userId : userId,
            date : date,
            content: content,
            bmr: bmr,
            url: url,
        })
        console.log(newRecord)
        await newRecord.save(async function () {
            try {
              user.records.push(newRecord._Id);
              await user.save();
            } catch (err) {
              console.log(err);
            }
          });

          for(let i in foodList){
              let foodId = foodList[i].foodId
              let name = foodList[i].name
              let amount = foodList[i].amount
              let kcal = foodList[i].kcal
              let resultKcal = (kcal * amount)
              Math.round(resultKcal)
              console.log(resultKcal)
              let foodRecord = new FoodRecord({
                  foodId,
                  name,
                  amount,
                  resultKcal,
                  type,
              })
 
              await foodRecord.save(async function () {
                  try {
                    newRecord.foodRecords.push(foodRecord.foodRecordId);
                    await newRecord.save();
                  } catch (err) {
                    console.log(err);
                  }
                });
          }  

        res.sendStatus(200)
    
    }else{              // 오늘 하루 칼로리 기록이 있을때 (추가)
        if (record.bmr !== bmr){
          record.bmr = bmr;
          await record.save()
        }
        // createFoodRecord(foodList)

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
    const { foodList, content } = req.body
    // const userId = req.user.userId

    const record = await Record.findById(recordId)

    for(let i in record.foodRecords){                 //foodRecord에 있는 기록 삭제하기
        FoodRecord.findByIdandDelete(record.foodRecord[i])
    }
    
    record.content = content
    record.foodRecords = []                         //user record에 연결되어있는 foodRecords 비우고 다시 넣기
    createFoodRecord(foodList)
    await record.save()   
    res.sendStatus(200)
})

router.delete('/:recordId', async(req,res) => {
    const { recordId } = req.params;
    
    Record.findByIdandDelete(recordId);
    res.sendStatus(200)
})




export default router;