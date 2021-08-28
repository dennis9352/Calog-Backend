import mongoose from 'mongoose'
import {conn} from './index.js'

export const mostUsedSchema = new mongoose.Schema({
    keyword: {
      type: String,
    },
    times: {
      type: Number,
    },
    
});

export default conn.model('MostUsed', mostUsedSchema)