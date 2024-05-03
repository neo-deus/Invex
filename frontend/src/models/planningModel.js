import mongoose from "mongoose"
const Schema = mongoose.Schema;

const planSchema = new Schema({
    Title: {
        type: String,
        required: true,
    },
    GoalTarget: {
        type: Number,
        required: true,
        default:0
    },
    CurrentAmount: {
        type: Number,
        default: 0
    },
    Achieved: {
        type: Number,
        default: 0
    },
    Date: {
        type: Date,
        default: Date.now
    }
});

const TargetSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    Plans: [planSchema]  // Embedding the Plan schema in the User schema
});

const TargetModel = mongoose.models.Target ||mongoose.model('Target', TargetSchema);
module.exports = TargetModel;