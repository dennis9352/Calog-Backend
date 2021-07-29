import express from "express";

const router = express.Router();

router.get('/', async(req, res) => {
    const { date } = req.body;
    const year = date.split('/')[0]
    const month = date.split('/')[1]

    const calendar = Record.find(
        {
            $and : [{ userId }, { year : year }, { month : month }]
        }).exec().sort("-day")
    
    res.status(200).json({ calendar })
})



export default router;