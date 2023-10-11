const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
    name: {
        type: String
    },
    company_name: {
        type: String,
    },
    location: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    past_hired_list: {
        type: Array
    },
    phone: {
        type: Number
    },
    profile_pic: {
        type: String
    },
    jobs: {
        type: Array
    },
    company_verified: {
        type: Boolean
    },
    website_link: {
        type: String
    },
    onboarding: {
        type: Boolean,
        default: false
    },
    profile_likes: [{
        type: Schema.Types.ObjectId,
        ref:'recruiter',
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref:'recruiter',
    }]
})

module.exports = recruiterModel = mongoose.model('recruiter', recruiterSchema)