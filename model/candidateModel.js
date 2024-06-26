const { Schema } = require("mongoose");
const User = require('./userModal');
const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
    status: {
        type: String
    },
    type: {
        type: String
    },
    location: {
        country: {
            type: String
        },
        city: {
            type: String
        }
    },
    skill_set: [{
        skill: {
            type: String
        },
        percentage: {
            type: Number
        }
    }],
    experience: [{
        total_exp: {
            type: String
        },
        company_name: {
            type: String
        },
        position: {
            type: String
        },
        description: {
            type: String
        }
    }],
    about_us: {
        type: String
    },
    user_verified: {
        type: Boolean,
        default: false
    },
    onboarding_1: {
        type: Boolean,
        default: false
    },
    onboarding_2: {
        type: Boolean,
        default: false
    },
    education: [{
        course_name: {
            type: String
        },
        provider: {
            type: String
        },
        education_exp: {
            type: String
        }
    }],
    certifications: [{
        name: {
            type: String
        },
        provider: {
            type: String
        },
        date: {
            type: Date
        },
        image: {
            type: String
        },
        verified: {
            type: String
        }
    }],
    portfolio_link: {
        type: String
    },
    profile_likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]
})


const candidateModel = User.discriminator('Candidate', candidateSchema);

module.exports = candidateModel;