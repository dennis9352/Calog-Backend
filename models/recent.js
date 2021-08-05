import mongoose from 'mongoose'

export const recentSchema = new mongoose.Schema({
    keyword: {
      type: Array,
    },
    
});

export default mongoose.model('Recent', recentSchema)