const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId

const jobSchema = new mongoose.Schema({
    job_title: {
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
    min_exp: {
        type: Number,
    },
    job_type: {
        type: String
    },
    required_skill_set: [{
        skill_name: {
            type: String
        },
        min_skill_exprnce: {
            type: Number
        }
    }],
    job_description : {
        type: String
    },
    applicants: {
        type: Array
    },
    job_active: {
        type: Boolean
    },
    recruiter: {
        type: ObjectId
    },
    isRemote: {
        type: Boolean
    }
})

module.exports = jobModel = mongoose.model('jobs', jobSchema)