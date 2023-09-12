const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId

const jobSchema = new mongoose.Schema({
    job_title: {
        type: String
    },
    min_exp: {
        type: Number,
    },
    job_type: {
        type: String
    },
    required_skill_set: {
        skill_name: {
            type: String
        },
        min_skill_perc: {
            type: Number
        }
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
    location: {
        type: String
    },
    isRemote: {
        type: Boolean
    }
})

module.exports = adminModel = mongoose.model('jobs', jobSchema)