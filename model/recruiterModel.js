const { Schema } = require("mongoose");
const User = require('./userModal'); 
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
        ref:'User',
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref:'User',
    }]
})

const Recruiter = User.discriminator('Recruiter', recruiterSchema);

module.exports = Recruiter;