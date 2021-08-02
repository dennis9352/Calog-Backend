import mongoose from 'mongoose'

export const mostUsedSchema = new mongoose.Schema({
    keyword: {
      type: String,
    },
    times: {
      type: Number,
    },
    
});

export default mongoose.model('MostUsed', mostUsedSchema)