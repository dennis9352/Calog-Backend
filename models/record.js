import mongoose from 'mongoose'

export const recordSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    foodRecords: {
        type: mongoose.Schema.Types.ObjectId
    },
    exerciseRecords: {
        type: mongoose.Schema.Types.ObjectId
    },
    content: {
        type: String,
    },
    foodTotal: {
        type: Number,
    },
    exerciseTotal: {
        type: Number,
    },
    bmr: {
        type: Number,
        required: true,
    },
    doDate: {
        type: Date,
        required: true,
    }

});

export default mongoose.model('Record', recordSchema)