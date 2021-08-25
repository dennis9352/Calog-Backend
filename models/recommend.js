import mongoose from 'mongoose'
import {conn} from './index.js'

export const recommendSchema = new mongoose.Schema({
    name: {
        type: String
    },
    kcal:{
        type: Number
    },
    foodId:{
        type: String
    }
    
});

export default conn.model('Recommend', recommendSchema)