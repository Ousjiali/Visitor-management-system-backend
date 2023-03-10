const mongoose  = require("mongoose");
const Schema = mongoose.Schema;

const TestDetails = new Schema({
    title: {
        type: String,
        required: [true, "Please enter test title"],
    },
    timer: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('test', TestDetails);