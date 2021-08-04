import mongoose from 'mongoose'

export const userSchema = new mongoose.Schema({
    socialtype:{ type: String },
    socialId:{ type: String },
    email: { type: String,trim: true, unique: true},
    password: { type: String, trim: true },
    nickname: { type: String, trim: true },
    profile_image: { type: String, trim: true },
    gender: { type: String},
    weight: { type: Number,default: 0},
    height: { type: Number,default: 0},
    age: { type: Number,default: 0},
    goal: { type: Number, default: 0},
    control: { type: String, default: 0},
    foodFavorites: {type: mongoose.Schema.Types.ObjectId,},
    records: {type: mongoose.Schema.Types.ObjectId,},
});

export default mongoose.model('User', userSchema)