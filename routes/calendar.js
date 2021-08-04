import express from "express";
import { checkPermission } from "../middlewares/checkPermission.js";
import Record from "../models/record.js"

const router = express.Router();

router.get('/:date',checkPermission, async(req, res) => {
    const { date } = req.params;
    const year = date.split('-')[0]
    const month = date.split('-')[1]
    const userId = res.locals.user._id
    const record = await Record.find(
        {
            $and : [{ userId : userId }, { year : year }, { month : month }]
        }, 
        {
            "bmr":1, "totalCalories":1, "date": 1,
        }).exec()
    
    res.status(200).json({ record })
})

router.get('/detail/:date',checkPermission, async(req, res) => {
    const { date } = req.params;
    const userId = res.locals.user._id

    const record = await Record.find(
        {
            $and : [{ userId : userId }, { date : date }]
        }).populate("foodRecords").exec()
 
    res.status(200).json({ record })
})

export default router;