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
    let { date, foodList, contents, url, type } = req.body
    url = {
      url : url,
      type : type
    }

    contents = {
      contents : contents,
      type : type
    }
    const newdate = moment()
    const todayDate = newdate.format("YYYY-MM-DD")
    const year = date.split("-")[0]
    const month = date.split("-")[1]
    moment.tz.setDefault("Asia/Seoul");
    
    if(!res.locals.user){                     // 비로그인유저
      res.send({"message" : "로그인유저가 아닙니다."})
      return;
    }

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
          if (url.url !== ""){              // 이미지가 빈값이 아니라면 추가
            newRecord.url = url
          }
          if (contents.contents !== ""){    // 메모가 빈값이 아니라면 추가
            newRecord.contents = contents
          }

          for(let i in foodList){               //먹은 음식 하나씩 저장
              let foodId = foodList[i].foodId
              let name = foodList[i].name
              let amount = foodList[i].amount
              let kcal = foodList[i].kcal
              let resultKcal = Math.round(kcal * amount)
              let forOne = foodList[i].forOne
              let measurement = foodList[i].measurement

              let foodRecord = await FoodRecord.create({
                  foodId : foodId,
                  name : name,
                  kcal : kcal,
                  amount : amount,
                  resultKcal : resultKcal,
                  forOne : forOne,
                  measurement: measurement,
                  type: type,
                  date: date,
                  userId: userId
              })
                newRecord.foodRecords.push(foodRecord._id);     //먹은 음식들 기록에 저장
                newRecord.totalCalories =+ resultKcal

            }
            
            await newRecord.save(async function () {
              try {
                user.records.push(newRecord._id);   //해당 유저에 기록 저장
                user.deleteList = []
                await user.save()
              } catch (err) {
                console.log(err);
              }
            });
            
            res.sendStatus(200)
      }else{              // 해당 날짜 하루 칼로리 기록이 이미 있을때 (추가)
        
        if (record.bmr !== bmr && date === todayDate){    //기록의 기초대사량이 지금 기초대사량이랑 다르고 날짜가 오늘 날짜이면 변경
          record.bmr = bmr;
        }
        
        for(let i in foodList){
          let foodId = foodList[i].foodId
          let name = foodList[i].name
          let amount = foodList[i].amount
          let kcal = foodList[i].kcal
          let resultKcal = Math.round(kcal * amount)
          let forOne = foodList[i].forOne
          let measurement = foodList[i].measurement
          
          let foodRecord = await FoodRecord.create({
              foodId : foodId,
              name : name,
              kcal: kcal,
              amount : amount,
              resultKcal : resultKcal,
              forOne : forOne,
              measurement: measurement,
              type: type,
              date: date,
              userId: userId
          })
            record.foodRecords.push(foodRecord._id);
            record.totalCalories += resultKcal
        }
        if(url.url !== ""){             // 이미지 array push
          record.url.push(url)
        }
        
        if(contents.contents !== ""){    // 메모 push
          record.contents.push(contents)
        }

        await record.save()
        
        user.deleteList = []
        await user.save()
        res.sendStatus(200)
    } 
    }catch(err){
        console.log(err)
        res.status(400).send({
            errorMessage: "Record 등록에 실패했습니다."
        })
    }
});

router.delete('/:recordId',isAuth, async(req,res) => {
    const { recordId } = req.params
    const { date, type } = req.body
    const userId = res.locals.user._id
    const record = await Record.findById(recordId).populate('foodRecords').exec()
    let totalCalories = record.totalCalories
    const user = await User.findById(userId)
    const deleteList = []
    try{
      // 해당 type 칼로리 기록 삭제와 동시에 삭제 리스트 저장
    for(let i=record.foodRecords.length -1; i >= 0; i--){
      if(record.foodRecords[i].type === type){
        deleteList.push(record.foodRecords[i])
        totalCalories -= record.foodRecords[i].resultKcal
        record.foodRecords.splice(i,1)
      }
    } // 해당 type 이미지 삭제
    for(let i=record.url.length -1; i >= 0; i--){
      if(record.url[i].type === type){
        record.url.splice(i,1)
      }
    } // 해당 type 메모 삭제
    for(let i=record.contents.length -1; i >= 0; i--){
      if(record.contents[i].type === type){
        record.contents.splice(i,1)
      }
    }

    await FoodRecord.deleteMany({ 
      userId: userId, 
      date: date, 
      type : type
    }).exec()

    record.totalCalories = totalCalories
    await record.save()
    //만약 기록에 칼로리 기록이 없다면 삭제
    if (!record.foodRecords.length){
      await Record.findByIdAndDelete(recordId)
      for(let i in user.records){
        if(user.records[i] == recordId){
          user.records.splice(i,1)
        }
      }
    }
    user.deleteList.push(deleteList)
    await user.save()

    res.sendStatus(200)

  }catch(err){
    console.log(err)
    res.status(400).send({
      errorMessage: "기록 삭제에 실패했습니다"
    })
  }
})


export default router;