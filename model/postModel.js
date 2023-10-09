const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const postSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        enum: ['candidate', 'recruiter'],
    },
    time: {
        type: Date,
        default: Date.now
    },
    text: {
        type: String
    },
    image: {
        type: String
    },
    video : {
        type: String
    },
    likes_details: [{
        user_id: {
            type: Schema.Types.ObjectId,
            enum: ['candidate', 'recruiter'],
        },
    }],
    comments: [
        {
            message: String,
            user_id: {
                type: Schema.Types.ObjectId,
                enum: ['candidate', 'recruiter'],
            },
            time: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

module.exports = postModel = mongoose.model('post', postSchema)