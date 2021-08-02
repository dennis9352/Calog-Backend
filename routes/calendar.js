import express from "express";

const router = express.Router();

router.get('/dash', async(req, res) => {
    const {date} = req.body;
    //const { userId } = res.locals.userId
    const year = date.split('-')[0]
    const month = date.split('-')[1]
    const day = date.split('-')[2]

    const dash = Record.find(
        {
            $and : [{ userId : userId }, { year : year }, { month : month }, { day: day }]
        }).exec()
    
    res.status(200).json({ dash })
})

router.get('/', async(req, res) => {
    const { date } = req.body;
    //const { userId } = res.locals.userId
    const year = date.split('-')[0]
    const month = date.split('-')[1]
    const day = date.split('-')[2]

    const calendar = Record.find(
        {
            $and : [{ userId : userId }, { year : year }, { month : month }, { day: day }]
        }).exec()
    
    res.status(200).json({ calendar })
})

export default router;