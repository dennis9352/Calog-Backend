import express from "express";
import aRouter from "./a.js";
import bRouter from "./b.js";
import cRouter from "./c.js";

const router = express.Router();

router.use("/a", aRouter);
router.use("/b", bRouter);
router.use("/c", cRouter);
//s

export default router;
