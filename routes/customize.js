import express from "express";
import { isAuth } from "../middlewares/auth.js";
import Food from "../models/food.js";
import FoodRecord from "../models/foodRecord.js";
import Meal from "../models/meal.js";
import NewFood from "../models/newFood.js";
import Users from "../models/users.js";

const router = express.Router();

//직접추가 CREATE
router.post("/newFood", isAuth, async (req, res) => {
  let {
    name,
    kcal,
    forOne,
    measurement,
    carbo,
    protein,
    fat,
    sugars,
    fattyAcid,
    transFattyAcid,
    unFattyAcid,
    cholesterol,
    natrium,
  } = req.body;
  const userId = res.locals.user._id;

  try {
    const newFood = await NewFood.create({
      userId: userId,
      name: name,
      kcal: kcal,
      forOne: forOne,
      measurement: measurement,
      carbo: carbo,
      protein: protein,
      fat: fat,
      sugars: sugars,
      fattyAcid: fattyAcid,
      transFattyAcid: transFattyAcid,
      unFattyAcid: unFattyAcid,
      cholesterol: cholesterol,
      natrium: natrium,
    });

    res.status(200).json(newFood._id);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "직접추가에 실패했습니다",
    });
  }
});
//직접추가 READ
router.get("/newFood", isAuth, async (req, res) => {
  const userId = res.locals.user._id;
  try {
    const newFood = await NewFood.find({ userId: userId });

    res.json(newFood);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errmessage: "직접추가 불러오기에 실패했습니다",
    });
  }
});

//직접추가 DELETE
router.delete("/newFood/:newFoodId", isAuth, async (req, res) => {
  const { newFoodId } = req.params;

  try {
    await NewFood.findByIdAndDelete(newFoodId);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "직접추가 삭제에 실패했습니다",
    });
  }
});
//자기만의 식단 CREATE
router.post("/meal", isAuth, async (req, res) => {
  const userId = res.locals.user._id;
  const { name, foodList } = req.body;
  try {
    const newMeal = new Meal({
      userId: userId,
      name: name,
      foodList: [],
    });

    for (let i in foodList) {
      let foodSet = {
        foodId: foodList[i].foodId,
        name: foodList[i].name,
        kcal: foodList[i].kcal,
        amount: foodList[i].amount,
        forOne: foodList[i].forOne,
        measurement: foodList[i].measurement,
      };
      newMeal.foodList.push(foodSet);
    }

    await newMeal.save();

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errmessage: "나만의 식단추가에 실패했습니다",
    });
  }
});

//자기만의 식단 READ
router.get("/meal", isAuth, async (req, res) => {
  const userId = res.locals.user._id;
  try {
    const meal = await Meal.find({ userId: userId });

    res.json(meal);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errmessage: "나만의식단 불러오기에 실패했습니다",
    });
  }
});

//자기만의 식단 UPDATE
router.put("/meal/:mealId", isAuth, async (req, res) => {
  const { mealId } = req.params;
  const { name, foodList } = req.body;
  try {
    const meal = await Meal.findById(mealId).exec();
    meal.name = name;
    meal.foodList = [];

    for (let i in foodList) {
      let foodSet = {
        foodId: foodList[i].foodId,
        name: foodList[i].name,
        kcal: foodList[i].kcal,
        amount: foodList[i].amount,
        forOne: foodList[i].forOne,
        measurement: foodList[i].measurement,
      };
      meal.foodList.push(foodSet);
    }
    await meal.save();

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "나만의 식단 수정에 실패했습니다",
    });
  }
});

router.put('/addMetaData', async(req,res) => {
  const foodRecords = await FoodRecord.find({})
  try{
  for(let i in foodRecords){
    if(!foodRecords[i].forOne){
      let oriFood = await Food.findById(foodRecords[i].foodId).exec()
      if(oriFood){
      foodRecords[i].forOne = oriFood.forOne
      foodRecords[i].measurement = oriFood.measurement
      foodRecords[i].save()
      }
    }
  }
  const records = Record.find({}).exec()
  

  res.sendStatus(200)
}catch(err){
  console.log(err)
}
})

export default router;
