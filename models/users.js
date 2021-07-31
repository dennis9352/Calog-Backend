import mongoose from 'mongoose'

export const userSchema = new mongoose.Schema({
    // loginId: { type: String, required: true, trim: true, unique: true},
    email: { type: String, required: true, trim: true, unique: true},
    password: { type: String, required: true, trim: true },
    nickname: { type: String, required: true, trim: true, unique: true},
    gender: { type: String},
    weight: { type: Number},
    height: { type: Number},
    age: { type: Number},
    control: { type: String},
    foodFavorites: {type: mongoose.Schema.Types.ObjectId,},
    records: {type: mongoose.Schema.Types.ObjectId,},
});

export default mongoose.model('User', userSchema)
