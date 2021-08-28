import mongoose from 'mongoose'
import {conn} from './index.js'

export const feedbackSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    contents: {
        type: String,
    },
    userId: {
        type: String,
    },
    nickname: {
        type: String,
    },
    date: {
        type: String,
    },
    phoneNum: {
        type: String,
        default: "n/a",
    },
    instagramId: {
        type: String,
        default: "n/a",
    },
});

export default conn.model('Feedback', feedbackSchema)