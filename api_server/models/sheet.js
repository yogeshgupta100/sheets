const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    cellId: {
        type: String,
        required: true
    },
    previousValue: {
        type: String,
        required: true
    },
    newValue: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const sheetSchema = new mongoose.Schema({
    sheetId: {
        type: String,
        required: true,
        unique: true
    },
    history: [historySchema],
    users: [{
        type: String,
        required: true
    }]
});

const Sheet = mongoose.model('Sheet', sheetSchema);

module.exports = Sheet;
