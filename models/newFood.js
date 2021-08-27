import mongoose from 'mongoose'
import {conn} from './index.js'

export const newFoodSchema = new mongoose.Schema({
    userId: {
      type: String,
    },
    name: {
      type: String,
    },
    kcal: {
      type: String,
    },
    protein:{
        type: String,
        default: "-",
    },
    fat:{
        type: String,
        default: "-",
    },
    carbo:{
        type: String,
        default: "-",
    },
    sugars:{
        type: String,
        default: "-",
    },
    natrium:{
        type: String,
        default: "-",
    },
    cholesterol:{
        type: String,
        default: "-",
    },
    fattyAcid:{
        type: String,
        default: "-",
    },
    unfattyAcid:{
        type: String,
        default: "-",
    },
    transFattyAcid:{
        type: String,
        default: "-",
    }
});

export default conn.model('NewFood', newFoodSchema)