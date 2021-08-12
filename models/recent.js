import mongoose from 'mongoose'
import {conn} from './index.js'

export const recentSchema = new mongoose.Schema({
    keyword: {
      type: Array,
    },
    userId: {
      type: String,
    },
});

export default conn.model('Recent', recentSchema)