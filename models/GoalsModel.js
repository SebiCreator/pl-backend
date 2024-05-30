const mongoose = require('mongoose');


const Subgoal = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    maxCount: {
        type: Number,
        required: true
    },
    chatSessionId : {
        type: String,
        required: false
    },
    difficulty : {
        type: String,
        required: true
    }
})

const GoalsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    focus: {
        type: String,
        required: false
    },
    subgoals: {
        type: [Subgoal],
        required: true
    },
})


module.exports = mongoose.model('Goals', GoalsSchema);