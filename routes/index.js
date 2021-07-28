import express from "express";
import recordRouter from "./record.js";
import calendarRouter from "./calendar.js";
import homeRouter from "./home.js";


const router = express.Router();

router.use("/record", recordRouter);
router.use("/calendar", calendarRouter);
router.use("/home", homeRouter);

export default router;
