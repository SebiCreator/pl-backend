const mongoose = require('mongoose');


const PreferencesSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    summary : {
        type: String,
        required: true
    },
    testTypes : {
        type: [String],
        required: false, // Not needed yet
    }
})

module.exports = mongoose.model('Preferences', PreferencesSchema);