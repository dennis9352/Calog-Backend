import express from "express";


const router = express.Router();


router.get('/oauth', (req, res) =>{
    res.send('성공')
})




export default router;