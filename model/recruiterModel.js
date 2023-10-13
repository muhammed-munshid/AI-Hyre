const { Schema } = require("mongoose");
const User = require('./userModal');
const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
    job_title: {
        type: String,
    },
    company_name: {
        type: String,
    },
    website_link: {
        type: String
    },
    industry: {
        type: String
    },
    type: {
        type: String
    },
    location: {
        city: {
            type: String
        },
        country: {
            type: String
        }
    },
    company_logo: {
        type: String
    },
    founded: {
        type: Date
    },
    size_of_company: {
        type: String
    },
    past_hired_list: {
        type: Array
    },
    jobs: {
        type: Array
    },
    company_verified: {
        type: Boolean
    },
    is_company: {
        type: Boolean
    },
    onboarding: {
        type: Boolean,
        default: false
    },
    profile_likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]
})

const Recruiter = User.discriminator('Recruiter', recruiterSchema);

module.exports = Recruiter;