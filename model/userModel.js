const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
    },
    phone: {
        type: Number
    },
    password: {
        type: String
    },
    location: {
        type: String
    },
    skill_set: [{
        skill: {
            type: String
        },
        percentage: {
            type: Number
        }
    }],
    profile_pic: {
        type: String
    },
    experience: [{
        total_time: {
            type: String
        },
        company_name: {
            type: String
        },
        position: {
            type: String
        }
    }],
    user_verified: {
        type: Boolean
    },
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
    profile_likes: {
        type: Number
    },
    github_link: {
        type: String
    },
    status: {
        type: String
    }
})

module.exports = adminModel = mongoose.model('users', userSchema)