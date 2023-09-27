const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    recruiter: {
        type: Schema.Types.ObjectId,
        ref: 'recruiterModel',
        required: true
    },
    candidate: {
        type: Schema.Types.ObjectId,
        ref: 'candidateModel',
        required: true
    },
    job_post: {
        type: Schema.Types.ObjectId,
        ref: 'jobModel',
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
            ref: 'userModel',
            required: true
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'userModel',
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

module.exports = adminModel = mongoose.model('chats', chatSchema)