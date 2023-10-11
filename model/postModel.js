const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: ['candidate', 'recruiter'],
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

postSchema.index({ _id: 1 });

module.exports = postModel = mongoose.model('post', postSchema)