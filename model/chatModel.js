const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
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
            ref: 'User',
            required: true
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
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

// chatSchema.index({ _id: 1 });

const chatModel = mongoose.model('chats', chatSchema);
module.exports = chatModel