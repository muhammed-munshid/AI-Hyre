const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    recruiter: {
        type: Schema.Types.ObjectId,
        ref: 'recruiter',
        required: true
    },
    candidate: {
        type: Schema.Types.ObjectId,
        ref: 'candidate',
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
            enum: ['candidate', 'recruiter'], // Reference dynamically based on senderType
            required: true
        },
        receiver: {
            type: Schema.Types.ObjectId,
            enum: ['candidate', 'recruiter'], // Reference dynamically based on receiverType
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
});

chatSchema.index({ _id: 1 });

module.exports = chatModel = mongoose.model('chats', chatSchema);
