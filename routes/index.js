import express from "express";
import userRouter from "./user.js";
import recordRouter from "./record.js";
import calendarRouter from "./calendar.js";
import homeRouter from "./home.js";
import auth_kakaoRouter from "./auth_kakao.js";
import auth_googleRouter from "./auth_google.js";
import favoriteRouter from "./favorite.js";

const router = express.Router();

router.use("/favorite", favoriteRouter);
router.use("/user", userRouter);
router.use("/record", recordRouter);
router.use("/calendar", calendarRouter);
router.use("/home", homeRouter);
router.use("/auth_kakao", auth_kakaoRouter);
router.use("/auth_google", auth_googleRouter);

export default router;
