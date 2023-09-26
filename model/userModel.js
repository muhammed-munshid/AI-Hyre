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
        type:String
    },
    user_verified: {
        type: Boolean,
        default: false
    },
    on_boarding_1: {
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
    profile_likes: {
        type: Number
    },
    portfolio_link: {
        type: String
    },
    status: {
        type: String
    }
})

module.exports = adminModel = mongoose.model('users', userSchema)