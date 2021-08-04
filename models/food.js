import mongoose from 'mongoose'

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
    distance:{
      type: Number,
    }
});

foodSchema.virtual("foodId").get(function () {
    return this._id.toHexString();
  });
foodSchema.set("toJSON", {
    virtuals: true,
  });

export default mongoose.model('Food', foodSchema)