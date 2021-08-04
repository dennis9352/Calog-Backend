import mongoose from 'mongoose'

export const noticeSchema = new mongoose.Schema({
    title: {
      type: String,
    },
    contents: {
      type: Number,
    },
    date: {
        type: String,
    }
});

export default mongoose.model('Notice', noticeSchema)