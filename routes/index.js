import express from "express";
import recordRouter from "./record.js";
import calendarRouter from "./calendar.js";


const router = express.Router();

router.use("/record", recordRouter);
router.use("/calendar", calendarRouter);

export default router;
