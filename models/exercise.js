import mongoose from 'mongoose'

export const exerciseSchema = new mongoose.Schema({
    kcal: {
        type: Number,
    },
    name: {
        type: String, 
    }
});

export default mongoose.model('Exercise', exerciseSchema)