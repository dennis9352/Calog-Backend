import mongoose from "mongoose";
import { conn } from "./index.js";

export const recentSchema = new mongoose.Schema({
  keyword: {
    type: Array, //userId 하나당 여러개의 keyword를 배열로 저장하여 한명의 유저가 여러 최근검색어 값을 가질 수 있도록함.
  },
  userId: {
    type: String,
  },
});

export default conn.model("Recent", recentSchema);
