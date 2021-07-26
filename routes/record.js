import express from "express";

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
              Record.foodRecords.push(foodRecord._Id);
              await Record.save();
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
              Record.exerciseRecords.push(exerciseRecord._Id);
              await Record.save();
            } catch (err) {
              console.log(err);
            }
          });
    }
}


router.post('/', async (req,res) => {
    const { doDate, foodList, exerciseList, content, userId } = req.body
    // const userId = req.user.userId
    const year = doDate.split('/')[0]
    const month = doDate.split('/')[1]
    const day = doDate.split('/')[2]
    // todo doDate 년,월,일 쪼개기
    try{
    const user = User.findById({userId})
    const recordDate = await Record.find(
        {
          $and: [{ userId }, { doDate }]
        }).exec()

    if(!recordDate) {   // 오늘 하루 칼로리 기록이 없을때 (생성)
        const record = new Record({
            userId : userId,
            doDate : doDate,
            year: year,
            month: month,
            day: day,
            content: content,
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

})

router.delete('/:recordId', async(req,res) => {
    const { recordId } = req.params;
    
})




export default router;