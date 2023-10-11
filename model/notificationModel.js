const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref:'User',
    },
    text: {
        type: String
    },
    type: {
        type: String
    },
    link: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now
    },
})

module.exports = notificationModel = mongoose.model('post', notificationSchema)