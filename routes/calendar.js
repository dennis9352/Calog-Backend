import express from "express";
import Record from "../models/record.js"

const router = express.Router();

router.get('/dash', async(req, res) => {
    const {date, userId} = req.body;

    const record = await Record.find(
        {
            $and : [{ userId : userId }, { date : date }]
        }).populate("foodRecords").exec()
    
    res.status(200).json({ record })
})

router.get('/', async(req, res) => {
    const { date } = req.body;

    const record = await Record.find(
        {
            $and : [{ userId : userId }, { date : date }]
        }).populate("foodRecords").exec()
 
    res.status(200).json({ record })
})

export default router;