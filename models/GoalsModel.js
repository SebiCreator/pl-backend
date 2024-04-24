const mongoose = require('mongoose');


const Subgoal = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    testSummary : {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        required: true
    },
    lastChanged: {
        type: Date,
        required: true
    },
    level: {
        type: Number,
        required: true
    }
})

const GoalsSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    focus: {
        type: [String],
        required: true
    },
    subgoals: {
        type: [Subgoal],
        required: true
    },
    done: {
        type: Boolean,
        required: true
    },
    lastChanged: {
        type: Date,
        required: true
    },
})


module.exports = mongoose.model('Goals', GoalsSchema);