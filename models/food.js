import mongoose from 'mongoose'
import {conn2} from './indexAtlas.js'

export const foodSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    forOne: {
      type: Number,
      default: 0
    },
    kcal: {
      type: Number,
    },
    isLike:{
      type: Boolean,
    },
    measurement:{
      type: String,
      default: "g"
    },
    protein:{
      type: String,
      default: "-"
    },
    fat:{
      type: String,
      default: "-"
    },
    carbo:{
      type: String,
      default: "-"
    },
    sugars:{
      type: String,
      default: "-"
    },
    natrium:{
      type: String,
      default: "-"
    },
    cholesterol:{
      type: String,
      default: "-"
    },
    fattyAcid:{
      type: String,
      default: "-"
    },
    transFattyAcid:{
      type: String,
      default: "-"
    },
    unFattyAcid:{
      type: String,
      default: "-"
    }
});

foodSchema.virtual("foodId").get(function () {
  return this._id.toHexString();
});
foodSchema.set("toJSON", {
  virtuals: true,
});

export default conn2.model('Food', foodSchema)