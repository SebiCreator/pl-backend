const mongoose = require('mongoose');


const PreferencesSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    summary : {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Preferences', PreferencesSchema);