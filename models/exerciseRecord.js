import mongoose from 'mongoose'

export const exerciseRecordSchema = new mongoose.Schema({
    exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    quantity: {
        type: Number,
    },
    resultCalorie: {
        type: Number,
    }
});

export default mongoose.model('ExerciseRecord', exerciseRecordSchema)