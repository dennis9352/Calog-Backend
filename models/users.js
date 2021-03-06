import mongoose from "mongoose";
import { conn } from "./index.js";

const date = new Date();
const ryear = date.getFullYear();
const rmonth = date.getMonth() + 1;
const rdate = date.getDate();
const registerDate = `${ryear}-${rmonth >= 10 ? rmonth : "0" + rmonth}-${
  rdate >= 10 ? rdate : "0" + rdate
}`;

export const userSchema = new mongoose.Schema({
  socialtype: { type: String },
  socialId: { type: String },
  email: { type: String, trim: true, unique: true, default: Date.now() },
  password: { type: String, trim: true },
  nickname: { type: String, trim: true },
  profile_image: { type: String, trim: true, default: "없음" },
  gender: { type: String, default: "미입력" },
  weight: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  age: { type: Number, default: 0 },
  bmr: { type: Array, default: [{ bmr: 0, date: registerDate }] },
  heightBlind: { type: Boolean, default: false },
  weightBlind: { type: Boolean, default: false },
  bmrBlind: { type: Boolean, default: false },
});

export default conn.model("User", userSchema);
