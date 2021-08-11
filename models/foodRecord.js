import mongoose from 'mongoose'

export const foodRecordSchema = new mongoose.Schema({
    foodId: {
        type: String,
    },
    name: {
        type: String,
    },
    kcal: {
        type: Number,
    },
    amount: { 
        type: Number,
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