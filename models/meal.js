import mongoose from "mongoose";
import { conn } from "./index.js";

export const mealSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  name: {
    type: String,
  },
  foodList: {
    type: Array,
  },
});
mealSchema.virtual("mealId").get(function () {
  return this._id.toHexString();
});
mealSchema.set("toJSON", {
  virtuals: true,
});
export default conn.model("Meal", mealSchema);
