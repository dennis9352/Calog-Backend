import mongoose from 'mongoose'
import findOrCreate from 'mongoose-findorcreate'


export const userSchema = new mongoose.Schema({
    social:{ type: String },
    kakao_id: {type: Number},
    googleId:{type: String},
    naverId:{type: String},
    email: { type: String,trim: true, unique: true},
    password: { type: String, trim: true },
    nickname: { type: String, trim: true },
    gender: { type: Number,default: 0},
    weight: { type: Number,default: 0},
    height: { type: Number,default: 0},
    age: { type: Number,default: 0},
    goal: { type: Number, default: 0},
    control: { type: String, default: 0},
    foodFavorites: {type: mongoose.Schema.Types.ObjectId,},
    records: {type: mongoose.Schema.Types.ObjectId,},
});
userSchema.plugin(findOrCreate)
export default mongoose.model('User', userSchema)