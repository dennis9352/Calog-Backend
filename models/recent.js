import mongoose from 'mongoose'

export const recentSchema = new mongoose.Schema({
    keyword: {
      type: Array,
    },
    userId: {
      type: String,
    },
});

export default mongoose.model('Recent', recentSchema)