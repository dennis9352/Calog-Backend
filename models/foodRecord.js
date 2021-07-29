import mongoose from 'mongoose'

export const foodRecordSchema = new mongoose.Schema({
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    time: {
        type: String,
    },
    quantity: { 
        type: String,
    },
    resultCalorie: {
        type: Number,
    }
});

export default mongoose.model('FoodRecord', foodRecordSchema)