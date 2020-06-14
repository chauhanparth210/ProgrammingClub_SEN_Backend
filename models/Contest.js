const mongoose = require('mongoose')

const Contest = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    comments: [ new mongoose.Schema({
        text: {
            type: String,
            required: true,
        },
        posted_at: {
            type: Date,
            default: Date.now,
        }
    })]
})

module.exports = mongoose.model('Contest', Contest)