import mongoose from 'mongoose'

const date = new Date()
const ryear = date.getFullYear();
const rmonth = date.getMonth() + 1;
const rdate = date.getDate();
const registerDate = `${ryear}-${rmonth >= 10 ? rmonth : '0' + rmonth}-${rdate >= 10 ? rdate : '0' + rdate}`

export const userSchema = new mongoose.Schema({
    socialtype:{ type: String },
    socialId:{ type: String },
    email: { type: String,trim: true, unique: true,},
    password: { type: String, trim: true },
    nickname: { type: String, trim: true },
    profile_image: { type: String, trim: true },
    gender: { type: String},
    weight: { type: Number},
    height: { type: Number},
    age: { type: Number},
    bmr: {type: Array, default:[{bmr: 0, date: registerDate }]},
    foodFavorites: {type: mongoose.Schema.Types.ObjectId,},
    records: [{type: mongoose.Schema.Types.ObjectId, ref:'Record'}],
});

export default mongoose.model('User', userSchema)