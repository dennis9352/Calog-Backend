import mongoose from 'mongoose'

export const foodRecordSchema = new mongoose.Schema({
    foodId: {
        type: String,
    },
    name: {
        type: String,
    },
    amount: { 
        type: String,
    },
    resultKcal: {
        type: Number,
    },
    type: {
        type: String,
    },
    date: {
        type: String,
    },
    userId: {
        type: String,
    }
});
foodRecordSchema.virtual("foodRecordId").get(function () {
    return this._id.toHexString();
  });
foodRecordSchema.set("toJSON", {
    virtuals: true,
  });

export default mongoose.model('FoodRecord', foodRecordSchema)