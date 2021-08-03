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
    bmr: {type: Object},
    foodFavorites: {type: mongoose.Schema.Types.ObjectId,},
    records: {type: mongoose.Schema.Types.ObjectId,},
});

export default mongoose.model('User', userSchema)
