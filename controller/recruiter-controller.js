const recruiterModel = require('../model/recruiterModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const candidateModel = require('../model/candidateModel');
const jobModel = require('../model/jobModel');
const notificationModel = require('../model/notificationModel');

module.exports = {

    signUp: async (req, res) => {
        try {
            let { email, password } = req.body;
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            password = hashedPassword
            const recruiterExist = await recruiterModel.findOne({ email: email })
            if (!recruiterExist) {
                const recruiter = new recruiterModel({
                    email,
                    password
                });
                await recruiter.save();
                const newRecruiter = await recruiterModel.findOne({ email: email })
                newRecruiter.password = undefined
                const recruiterPayload = {
                    id: recruiter._id,
                    role: 'recruiter',
                };
                const token = jwt.sign(recruiterPayload, process.env.JWT_SECRET, {
                    expiresIn: '30d'
                })
                res.status(200).send({ message: 'Signup Success', _id: newRecruiter._id, candidate: false, token: token })
            } else {
                res.status(403).send({ message: 'You are already registered' })
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Something Error' })
        }
    },

    signIn: async (req, res) => {
        try {
            const { email, password } = req.body;
            const recruiter = await recruiterModel.findOne({ email: email })
            if (recruiter) {
                const isMatchPswrd = await bcrypt.compare(password, recruiter.password)
                if (!isMatchPswrd) {
                    res.status(200).send({ message: "Incorrect Password" })
                } else {
                    // eslint-disable-next-line no-undef
                    const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SECRET, {
                        expiresIn: '30d'
                    })
                    res.status(200).send({ message: "Login Successful", recruiterId: recruiter._id, recruiterName: recruiter.name, onboarding_1: recruiter, onboarding_2: recruiter.onboarding_2, token: token })
                }
            } else {
                res.status(200).send({ message: "Incorrect Email or Password" })
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Failed to SignIn' })
        }
    },

    viewProfile: async (req, res) => {
        try {
            const id = req.user._id
            const profile = await recruiterModel.findById(id).select('-password');
            res.status(200).send(profile);
        } catch (err) {
            console.log(err)
            res.status(400).send(err);
        }
    },

    addProfile: async (req, res) => {
        try {
            const recruiterId = req.user._id
            const { Firstname, Lastname, job_title, phone, profile_pic, company_name, website_link, industry, type, company_logo, founded, size_of_company, location, company_verified } = req.body;
            await recruiterModel.findByIdAndUpdate(recruiterId, {
                $set: {
                    Firstname,
                    Lastname,
                    job_title,
                    phone,
                    profile_pic,
                    company_name,
                    website_link,
                    industry,
                    type,
                    company_logo,
                    founded,
                    size_of_company,
                    location,
                    company_verified,
                    onboarding: true
                }
            })
            const updatedRecruiter = await recruiterModel.findById(recruiterId)
            updatedRecruiter.password = undefined
            res.status(200).send({ message: "Profile Updated", updatedRecruiter: updatedRecruiter })
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Somthing error' })
        }
    },

    dashboard: async (req, res) => {
        try {
            const user_id = req.user._id
            const candidates = await candidateModel.find({}, { password: 0 })
            const notifications = await notificationModel.find({ user_id: user_id })
            const posts = await postModel.find().populate({
                path: 'user_id',
                select: '-password'
            })
            res.status(200).send({ candidates, notifications, posts })
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Somthing error' })
        }
    },


    candidates: async (req, res) => {
        try {
            const candidates = await candidateModel.find({}, { password: 0 })
            res.status(200).send({ candidates: candidates })
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Somthing error' })
        }
    },

    candidateById: async (req, res) => {
        try {
            const candidateById = req.params.id
            const candidate = await candidateModel.findById(candidateById, { password: 0 })
            res.status(200).send({ candidate: candidate })
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Somthing error' })
        }
    },

    addJob: async (req, res) => {
        try {
            const recruiter = req.user._id
            const { job_title, location, min_exp, job_type, required_skill_set, job_description, job_active, isRemote } = req.body;
            const job = new jobModel({
                job_title,
                location,
                min_exp,
                job_type,
                required_skill_set,
                job_description,
                job_active,
                recruiter,
                isRemote
            });
            await job.save();
            const jobs = await jobModel.find()
            res.status(200).send({ message: 'Job created successful', jobs: jobs })
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Something Error' })
        }
    },

    editJob: async (req, res) => {
        try {
            const jobId = req.params.id
            const { job_title, location, min_exp, job_type, required_skill_set, job_description, job_active, isRemote } = req.body;
            await jobModel.findByIdAndUpdate(jobId, {
                $set: {
                    job_title,
                    location,
                    min_exp,
                    job_type,
                    required_skill_set,
                    job_description,
                    job_active,
                    isRemote
                }
            })
            const updatedJob = await jobModel.findById(jobId)
            res.status(200).send({ message: "Job Updated", updatedJob: updatedJob })
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Somthing error' })
        }
    },

    deleteJob: async (req, res) => {
        try {
            const id = req.params.id
            await jobModel.deleteOne({ _id: id })
            res.status(200).send({ delete: true })
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Somthing error' })
        }
    },

    jobs: async (req, res) => {
        try {
            const jobs = await jobModel.find()
            res.status(200).send({ jobs: jobs })
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Somthing error' })
        }
    },

    jobById: async (req, res) => {
        try {
            const jobById = req.params.id
            const job = await jobModel.findById(jobById)
            res.status(200).send({ job: job })
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Somthing error' })
        }
    },

}