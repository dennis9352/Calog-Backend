import express from "express";
import { isAuth } from "../middlewares/auth.js";
import Meal from "../models/meal.js";
import NewFood from "../models/newFood.js";

const router = express.Router();

//직접추가
router.post('/newFood',isAuth, async(req, res) => {
    let {name, kcal, forOne, measurement, carbo, protein, fat, sugars, fattyAcid, transFattyAcid, unFattyAcid, cholesterol, natrium} = req.body
    const userId = res.locals.user._id
    
    try{
    await NewFood.create({
        userId : userId,
        name : name, 
        kcal : kcal,
        forOne: forOne,
        measurement: measurement,
        carbo : carbo,
        protein : protein,
        fat : fat,
        sugars: sugars,
        fattyAcid : fattyAcid,
        transFattyAcid: transFattyAcid,
        unFattyAcid : unFattyAcid,
        cholesterol : cholesterol,
        natrium : natrium,
     })
    
    res.sendStatus(200)
    }catch(err){
        console.log(err)
        res.status(400).send({
            errorMessage: "직접추가에 실패했습니다"
        })
    }
})

router.get('/newFood',isAuth, async(req, res) => {
    const userId = res.locals.user._id
    try{
    const newFood = await NewFood.find({ userId : userId })

    res.json(newFood)
    }catch(err){
        console.log(err)
        res.status(400).send({
            errmessage: "직접추가 불러오기에 실패했습니다"
        })
    }
})

//자기만의 식단 CREATE
router.post('/meal', async(req, res) => {

})

//자기만의 식단 READ
router.get('/meal',isAuth, async(req, res) => {
    const userId = res.locals.user._id
    try{
    const meal = await Meal.find({ userId : userId })

    res.json(newFood)
    }catch(err){
        console.log(err)
        res.status(400).send({
            errmessage: "직접추가 불러오기에 실패했습니다"
        })
    }
})

//자기만의 식단 UPDATE
router.put('/meal/:mealId', async(req, res) => {
    
})

//자기만의 식단 DELETE
router.delete('/meal/:mealId', async(req, res) => {
    
})


export default router;