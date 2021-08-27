import mongoose from 'mongoose'
import {conn} from './index.js'

export const foodRecordSchema = new mongoose.Schema({
    foodId: {
        type: String,
    },
    name: {
        type: String,
    },
    kcal: {
        type: Number,
    },
    amount: { 
        type: Number,
    },
    resultKcal: {
        type: Number,
    },
    forOne:{
        type: Number,
    },
    measurement:{
        type: String,
    },
    type: {
        type: String,
    },
    date: {
        type: String,
    },
    userId: {
        type: String,
    }
});

export default conn.model('FoodRecord', foodRecordSchema)