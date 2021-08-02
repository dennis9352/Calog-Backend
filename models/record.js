import mongoose from 'mongoose'

export const recordSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    foodRecords: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foodRecord',
    },
    content: {
        type: String,
    },
    bmr: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    url: {
        type: Array,
        default: [],
    }
});
recordSchema.virtual("recordId").get(function () {
    return this._id.toHexString();
  });
recordSchema.set("toJSON", {
    virtuals: true,
  });

export default mongoose.model('Record', recordSchema)