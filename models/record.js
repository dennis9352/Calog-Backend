import mongoose from "mongoose";
import { conn } from "./index.js";

export const recordSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  foodRecords: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodRecord",
    },
  ],
  contents: {
    type: Array,
    default: [],
  },
  bmr: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  year: {
    type: String,
  },
  month: {
    type: String,
  },
  url: {
    type: Array,
    default: [],
  },
  totalCalories: {
    type: Number,
    default: 0,
  },
});
recordSchema.virtual("recordId").get(function () {
  return this._id.toHexString();
});
recordSchema.set("toJSON", {
  virtuals: true,
});

export default conn.model("Record", recordSchema);
