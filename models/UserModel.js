const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    motivation: {
        type: String,
        required: false
    },
    occupation: {
        type: String,
        required: false
    },
    sex: {
        type: String,
        required: false
    },
    language: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})



module.exports = mongoose.model('User', UserSchema);