import mongoose from 'mongoose'

export const favoriteSchema = new mongoose.Schema({
    userId: {
      type: String,
    },    
    foodId: {
      type: Array,
    },
});

export default mongoose.model('Favorite', favoriteSchema)