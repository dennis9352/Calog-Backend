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

export default mongoose.model('FoodRecord', foodRecordSchema)