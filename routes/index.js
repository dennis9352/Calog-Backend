import express from "express";
import userRouter from "./user.js";
import bRouter from "./b.js";
import cRouter from "./c.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/b", bRouter);
router.use("/c", cRouter);



export default router;
