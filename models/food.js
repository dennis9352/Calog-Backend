import mongoose from 'mongoose'
import {conn2} from './indexAtlas.js'

export const foodSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    forOne: {
      type: Number,
    },
    kcal: {
      type: Number,
    },
    isLike:{
      type: Boolean,
    },
    measurement:{
      type: String,
    },
    protein:{
      type: String,
    },
    fat:{
      type: String,
    },
    carbo:{
      type: String,
    },
    sugars:{
      type: String,
    },
    natrium:{
      type: String,
    },
    cholesterol:{
      type: String,
    },
    fattyAcid:{
      type: String,
    },
    transFattyAcid:{
      type: String,
    },
    unFattyAcid:{
      type: String,
    }
});

foodSchema.virtual("foodId").get(function () {
  return this._id.toHexString();
});
foodSchema.set("toJSON", {
  virtuals: true,
});

export default conn2.model('Food', foodSchema)