import mongoose from 'mongoose'
import {conn} from './index.js'

export const mealSchema = new mongoose.Schema({
    userId: {
      type: String,
    },    
    foodId: {
      type: Array,
    },
});

export default conn.model('Meal', mealSchema)