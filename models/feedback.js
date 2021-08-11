import mongoose from 'mongoose'

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
});

export default mongoose.model('Feedback', feedbackSchema)