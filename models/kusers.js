import mongoose from 'mongoose'

export const kuserSchema = new mongoose.Schema({

    nickname: { type: String, required: true, trim: true, unique: true},
    gender: { type: Number,},
    weight: { type: Number},
    height: { type: Number},
    age: { type: Number},
    goal: { type: Number},
    control: { type: String},
    foodFavorites: {type: mongoose.Schema.Types.ObjectId,},
    records: {type: mongoose.Schema.Types.ObjectId,},
});

export default mongoose.model('Kuser', kuserSchema)