import mongoose from 'mongoose'
import findOrCreate from 'mongoose-findorcreate'


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
    bmr: { type: Number},
    foodFavorites: {type: Array},
    records: {type: mongoose.Schema.Types.ObjectId, ref:'Record'},
});

export default mongoose.model('User', userSchema)
