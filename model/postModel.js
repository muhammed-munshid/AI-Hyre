const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
    video: {
        type: String
    },
    comments: [
        {
            message: String,
            user_id: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            time: {
                type: Date,
                default: Date.now
            }
        }
    ],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})



postSchema.virtual('likesCount').get(function() {
    return this.likes.length;
  });

  postSchema.virtual('commentsCount').get(function() {
    return this.comments.length;
  });
  

// postSchema.index({ _id: 1 });

const postModel = mongoose.model('post', postSchema)
module.exports = postModel