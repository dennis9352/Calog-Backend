import express from "express";
import userRouter from "./user.js";
import recordRouter from "./record.js";
import calendarRouter from "./calendar.js";
import homeRouter from "./home.js";
import noticeRouter from "./notice.js";
import auth_kakaoRouter from "./auth_kakao.js";
import auth_googleRouter from "./auth_google.js";
import auth_naverRouter from "./auth_naver.js";
import favoriteRouter from "./favorite.js";
import customizeRouter from "./customize.js";

const router = express.Router();

router.use("/favorite", favoriteRouter);
router.use("/user", userRouter);
router.use("/record", recordRouter);
router.use("/calendar", calendarRouter);
router.use("/home", homeRouter);
router.use("/customize", customizeRouter);
router.use("/notice", noticeRouter);
router.use("/auth_kakao", auth_kakaoRouter);
router.use("/auth_google", auth_googleRouter);
router.use("/auth_naver", auth_naverRouter);

export default router;
