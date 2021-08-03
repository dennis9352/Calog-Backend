import express from "express";

const router = express.Router();

router.get('/dash', async(req, res) => {
    const {date} = req.body;
    //const { userId } = res.locals.userId
    // const year = date.split('-')[0]
    // const month = date.split('-')[1]
    // const day = date.split('-')[2]
    const breakfast = []
    const lunch = []
    const dinner = []
    const snack = []
    const midnight = []

    const dash = Record.find(
        {
            $and : [{ userId : userId }, { date : date }]
        }).populate('foodRecords').exec()
    
    for(let i in dash.foodRecords){
        const type = dash.foodRecords[i].type
        
        if(type === "아침"){
            breakfast.push(dash.foodRecords[i])
        }else if (type === "점심"){
            lunch.push(dash.foodRecords[i])
        }else if (type === "저녁"){
            dinner.push(dash.foodRecords[i])
        }else if (type === "간식"){
            snack.push(dash.foodRecords[i])
        }else if (type === "야식"){
            midnight.push(dash.foodRecords[i])
        }
    }

    res.status(200).json({ breakfast,lunch,dinner,snack,midnight })
})

router.get('/', async(req, res) => {
    const { date } = req.body;
    //const { userId } = res.locals.userId
    // const year = date.split('-')[0]
    // const month = date.split('-')[1]
    // const day = date.split('-')[2]

    const calendar = Record.find(
        {
            $and : [{ userId : userId }, { date: date }]
        }).exec()
    

    res.status(200).json({ calendar })
})

export default router;