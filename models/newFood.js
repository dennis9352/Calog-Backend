import mongoose from "mongoose";
import { conn } from "./index.js";

export const newFoodSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  name: {
    type: String,
  },
  kcal: {
    type: String,
  },
  forOne: {
    type: Number,
    default: "0",
  },
  measurement: {
    type: String,
    default: "g",
  },
  protein: {
    type: String,
    default: "-",
  },
  fat: {
    type: String,
    default: "-",
  },
  carbo: {
    type: String,
    default: "-",
  },
  sugars: {
    type: String,
    default: "-",
  },
  natrium: {
    type: String,
    default: "-",
  },
  cholesterol: {
    type: String,
    default: "-",
  },
  fattyAcid: {
    type: String,
    default: "-",
  },
  unfattyAcid: {
    type: String,
    default: "-",
  },
  transFattyAcid: {
    type: String,
    default: "-",
  },
});

newFoodSchema.virtual("mealId").get(function () {
  return this._id.toHexString();
});
newFoodSchema.set("toJSON", {
  virtuals: true,
});

export default conn.model("NewFood", newFoodSchema);
