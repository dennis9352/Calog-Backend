import mongoose from "mongoose";
import { conn } from "./index.js";

export const favoriteSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  foodId: {
    type: Array, //userId 하나당 여러개의 foodId를 배열로 저장하여 한명의 유저가 여러 즐겨찾기 값을 가질 수 있도록함.
  },
});

export default conn.model("Favorite", favoriteSchema);
