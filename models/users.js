import mongoose from 'mongoose'
import findOrCreate from 'mongoose-findorcreate'



export const userSchema = new mongoose.Schema({
    social:{type: String},
    naverId:{type: String},
    googleId:{type: String},
    email: { type: String, required: true, trim: true, unique: true},
    password: { type: String, required: true, trim: true },
    nickname: { type: String, required: true, trim: true, unique: true},
    gender: { type: String},
    weight: { type: Number},
    height: { type: Number},
    age: { type: Number},
    bmr: {type: Object, default:{bmr: 0, date: String(new Date().getFullYear()) + "년 " + String(new Date().getMonth() + 1) + "월 " + String(new Date().getDate()) + "일 "}},
    foodFavorites: {type: mongoose.Schema.Types.ObjectId,},
    records: [{type: mongoose.Schema.Types.ObjectId, ref:'Record'}],
});

export default mongoose.model('User', userSchema)
