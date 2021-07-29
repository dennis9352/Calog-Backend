import express from "express";
// import User from "../models/user.js"
import FoodRecord from '../models/foodRecord.js'
// import { upload, S3 } from '../middlewares/imageUpload.js' 

const router = express.Router();

const createFoodRecord = async (foodList) => {
    for(let i in foodList){
        let foodId = foodList[i].foodId
        let quantity = foodList[i].quantity
        let time = foodList[i].time
        let resultCalorie = foodList[i].resultCalorie

        foodRecord = new FoodRecord({
            foodId,
            quantity,
            time,
            resultCalorie,
        })

        await foodRecord.save(async function () {
            try {
              record.foodRecords.push(foodRecord._Id);
              await record.save();
            } catch (err) {
              console.log(err);
            }
          });
    }
}

const createExerciseRecord = async(exerciseList) => {
    for(let i in exerciseList){
        let exerciseId = exerciseList[i].foodId
        let quantity = exerciseList[i].quantity
        let resultCalorie = exerciseList[i].resultCalorie

        exerciseRecord = new FoodRecord({
            exerciseId,
            quantity,
            resultCalorie,
        });

        await exerciseRecord.save(async function () {
            try {
              record.exerciseRecords.push(exerciseRecord._Id);
              await record.save();
            } catch (err) {
              console.log(err);
            }
          });
    }
}


router.post('/', async (req,res) => {
    const { doDate, foodList, exerciseList, content, userId } = req.body
    // const userId = req.user.userId
    const bmr = userId.bmr
    const year = doDate.split('/')[0]
    const month = doDate.split('/')[1]
    const day = doDate.split('/')[2]
    // todo doDate 년,월,일 쪼개기
    try{
    const user = User.findById({userId})
    let record = await Record.find(
        {
          $and: [{ userId }, { doDate }]
        }).exec()

    if(!record) {   // 오늘 하루 칼로리 기록이 없을때 (생성)
        let record = new Record({
            userId : userId,
            doDate : doDate,
            year: year,
            month: month,
            day: day,
            content: content,
            bmr: bmr,
        })
        await record.save(async function () {
            try {
              user.records.push(record._Id);
              await user.save();
            } catch (err) {
              console.log(err);
            }
          });
        createFoodRecord(foodList)
        createExerciseRecord(exerciseList)   

        res.sendStatus(200)
    
    }else{              // 오늘 하루 칼로리 기록이 있을때 (추가)

        if (record.bmr !== bmr){
          record.bmr = bmr;
          await record.save()
        }
        createFoodRecord(foodList)
        createExerciseRecord(exerciseList) 

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
    const { doDate, foodList, exerciseList, content, userId } = req.body
    // const userId = req.user.userId
    // const year = doDate.split('/')[0]
    // const month = doDate.split('/')[1]
    // const day = doDate.split('/')[2]
    // todo doDate 년,월,일 쪼개기

    const record = await Record.findById(recordId)
    
    // for(let i in record.foodRecords){
    //     FoodRecord.findByIdandDelete(record.foodRecord[i])
    // }
    record.foodRecords = []
    record.exerciseRecords = []
    record.content = content
    createFoodRecord(foodList)
    createExerciseRecord(exerciseList)
    await record.save()   
    res.sendStatus(200)
})

router.delete('/:recordId', async(req,res) => {
    const { recordId } = req.params;
    
    Record.findByIdandDelete(recordId);
    res.sendStatus(200)
})




export default router;