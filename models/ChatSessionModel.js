const mongoose = require('mongoose');

const ChatMessage = new mongoose.Schema({
    role:
    {
        type: String,
        required: true
    },
    content:
    {
        type: String,
        required: true
    },
})
const ChatSessionSchema = new mongoose.Schema({
    id:
    {
        type: String,
        required: true
    },
    messages: 
    {
        type: [ChatMessage],
        required: true
    }
})

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
