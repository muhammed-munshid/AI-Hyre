const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    recruiter: {
        type: Schema.Types.ObjectId,
        ref: 'recruiters',
        required: true
    },
    users: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'jobs',
        required: true
    },
    messages: [{
        message: {
            type: String,
            required: true
        },
        id: { type: String, required: true },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        time: {
            type: Date,
            required: true,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['sent', 'delivered', 'read'],
            required: true,
            default: 'sent'
        }
    }]
})

module.exports = chatModel = mongoose.model('chats', chatSchema)