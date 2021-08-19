import mongoose from 'mongoose'
import {conn} from './index.js'

export const exerciseSchema = new mongoose.Schema({
    kcal: {
        type: Number,
    },
    name: {
        type: String, 
    },
    url: {
        type: String,
    }
});

export default conn.model('Exercise', exerciseSchema)
