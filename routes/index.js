import express from "express";
import userRouter from "./user.js";
import recordRouter from "./record.js";
import calendarRouter from "./calendar.js";
import homeRouter from "./home.js";
import auth_kakaoRouter from "./auth_kakao.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/record", recordRouter);
router.use("/calendar", calendarRouter);
router.use("/home", homeRouter);
router.use("/auth_kakao", auth_kakaoRouter);

export default router;
