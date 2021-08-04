import mongoose from 'mongoose'
import findOrCreate from 'mongoose-findorcreate'


const date = new Date()
const ryear = date.getFullYear();
const rmonth = date.getMonth() + 1;
const rdate = date.getDate();
const registerDate = `${ryear}-${rmonth >= 10 ? rmonth : '0' + rmonth}-${rdate >= 10 ? rdate : '0' + rdate}`

export const userSchema = new mongoose.Schema({
    social:{type: String},
    naverId:{type: String},
    googleId:{type: String},
    email: { type: String, required: true, trim: true, unique: true},
    password: { type: String, required: true, trim: true},
    nickname: { type: String, required: true, trim: true, unique: true},
    gender: { type: String},
    weight: { type: Number},
    height: { type: Number},
    age: { type: Number},
    bmr: {type: Array, default:[{bmr: 0, date: registerDate }]},
    foodFavorites: {type: mongoose.Schema.Types.ObjectId,},
    records: [{type: mongoose.Schema.Types.ObjectId, ref:'Record'}],
});

export default mongoose.model('User', userSchema)
