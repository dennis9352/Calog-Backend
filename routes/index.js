import express from "express";
import userRouter from "./user.js";
import recordRouter from "./record.js";
import calendarRouter from "./calendar.js";
import homeRouter from "./home.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/record", recordRouter);
router.use("/calendar", calendarRouter);
router.use("/home", homeRouter);

export default router;
