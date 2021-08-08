import mongoose from 'mongoose'

export const exerciseSchema = new mongoose.Schema({
    kcal: {
        type: Number
    },
    time: {
        type: Number 
    },
    total: {
        type: Number
    },
});

export default mongoose.model('Exercise', exerciseSchema)