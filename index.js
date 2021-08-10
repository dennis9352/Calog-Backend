import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import dotenv from 'dotenv'
import "./models/index.js";
import passport from 'passport';
import session from 'express-session' 



dotenv.config()
const app = express();

const corsOption = {
    origin: "http://localhost:3000",
    Credential: true,
    optionSuccessStatus: 200,
};
//passportsetting
app.use(session({
    secret:'MySecret', 
    resave: false, 
    saveUninitialized:true,
    cookie:{
        httpOnly: true,
        secure: false
    }
}));
app.use(passport.initialize()); 
app.use(passport.session());



app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", router);
app.get('/', (req, res) => {
    res.send('테스트서버')
})

app.listen(process.env.PORT || 3000, () => {
    console.log("서버 연결 성공");
});
