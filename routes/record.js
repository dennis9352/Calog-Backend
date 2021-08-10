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
    let { date, foodList, contents, url, type} = req.body
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
    const year = todayDate.split("-")[0]
    const month = todayDate.split("-")[1]
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
            contents: contents,
            bmr: bmr,
            url: url,
          })

          for(let i in foodList){               //먹은 음식 하나씩 저장
              let foodId = foodList[i].foodId
              let name = foodList[i].name
              let amount = foodList[i].amount
              let kcal = foodList[i].kcal
              let resultKcal = Math.round(kcal * amount)

              let foodRecord = await FoodRecord.create({
                  foodId : foodId,
                  name : name,
                  amount : amount,
                  resultKcal : resultKcal,
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
                await user.save();
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
          
          let foodRecord = await FoodRecord.create({
              foodId : foodId,
              name : name,
              amount : amount,
              resultKcal : resultKcal,
              type: type,
              date: date,
              userId: userId
          })
            record.foodRecords.push(foodRecord._id);
            record.totalCalories += resultKcal
        }
        if(url){             // 수정해야할 이미지 array가 있으면 합치기
        const oldUrl = record.url
        const newUrl = oldUrl.concat(url)
        record.url = newUrl
        }
        
        if(contents){    // 수정해야할 메모 array가 있으면 합치기
          const oldContents = record.contents 
          const newContents = oldContents.concat(contents)
          record.contents = newContents
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

router.delete('/:recordId',isAuth, async(req,res) => {
    const { recordId } = req.params
    const { date, type } = req.body
    const userId = res.locals.user._id
    const record = await Record.findById(recordId).populate('foodRecords').exec()
    
    try{
    for(let i=record.foodRecords.length -1; i >= 0; i--){
      if(record.foodRecords[i].type === type){
        record.foodRecords.splice(i,1)
      }
    }
    for(let i=record.url.length -1; i >= 0; i--){
      if(record.url[i].type === type){
        record.url.splice(i,1)
      }
    }
    for(let i=record.contents.length -1; i >= 0; i--){
      if(record.contents[i].type === type){
        record.contents.splice(i,1)
      }
    }
    await FoodRecord.deleteMany({ 
      userId: userId, 
      date: date, 
      type : type
    })
    await record.save()
    res.sendStatus(200)

  }catch(err){
    console.log(err)
    res.status(400).send({
      errorMessage: "기록 삭제에 실패했습니다"
    })
  }
})


export default router;