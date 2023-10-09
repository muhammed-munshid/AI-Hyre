const candidateModel = require("../model/candidateModel");
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const jobModel = require("../model/jobModel");
const moment = require('moment');
const recruiterModel = require("../model/recruiterModel");
const chatModel = require("../model/chatModel");

module.exports = {

    signUp: async (req, res) => {
        try {
            let { email, password } = req.body;
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            password = hashedPassword
            const userExist = await candidateModel.findOne({ email: email })
            if (!userExist) {
                const user = new candidateModel({
                    email,
                    password
                });
                await user.save();
                const newUser = await candidateModel.findOne({ email: email })
                newUser.password = undefined
                const userPayload = {
                    id: user._id,
                    role: 'user',
                };
                const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
                    expiresIn: '30d'
                })
                res.status(200).send({ message: 'Signup Success', _id: newUser._id, candidate: true, token: token })
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
            const user = await candidateModel.findOne({ email: email })
            const recruiter = await recruiterModel.findOne({ email: email })
            if (user) {
                const userPayload = {
                    id: user._id,
                    role: 'user',
                };
                const isMatchPswrd = await bcrypt.compare(password, user.password)
                if (!isMatchPswrd) {
                    res.status(401).send({ message: "Incorrect Password" })
                } else {
                    // eslint-disable-next-line no-undef
                    const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
                        expiresIn: '30d'
                    })
                    res.status(200).send({ message: "Login Success", _id: user._id, name: user.name, onboarding_1: user.onboarding_1, onboarding_2: user.onboarding_2, token: token, candidate: true })
                }
            }
            else if (recruiter) {
                const recruiterPayload = {
                    id: recruiter._id,
                    role: 'recruiter',
                };
                const isMatchPswrd = await bcrypt.compare(password, recruiter.password)
                if (!isMatchPswrd) {
                    res.status(401).send({ message: "Incorrect Password" })
                } else {
                    // eslint-disable-next-line no-undef
                    const token = jwt.sign(recruiterPayload, process.env.JWT_SECRET, {
                        expiresIn: '30d'
                    })
                    res.status(200).send({ message: "Login Successful", onboarding: recruiter.onboarding, id: recruiter._id, token: token, candidate: false })
                }
            } else {
                res.status(401).send({ message: "Incorrect Email or Password" })
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Failed to SignIn' })
        }
    },

    signInWithJwt: async (req, res) => {
        const jwtPayload = req.jwtPayload
        const token = req.token
        try {
            if (jwtPayload.role === 'user') {
                if (req.user) {
                    await candidateModel.findByIdAndUpdate(req.user._id, {
                        $set: {
                            user_verified: true
                        }
                    })
                    res.json({ authorization: true, _id: req.user._id, email: req.user.email, onboarding_1: req.user.onboarding_1, onboarding_2: req.user.onboarding_2, candidate: true, token: token });
                } else {
                    res.json({ authorization: false });
                }
            } else {
                if (req.user) {
                    res.json({ authorization: true, _id: req.user._id, email: req.user.email, onboarding: req.user.onboarding, candidate: false, token: token });
                } else {
                    res.json({ authorization: false });
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Failed to SignIn' })
        }
    },

    updateCandidate: async (req, res) => {
        try {
            const userId = req.user._id
            const { Firstname, Lastname, status, skill_set, profile_pic, phone, experience, education, certifications, portfolio_link, about_us } = req.body;
            await candidateModel.findByIdAndUpdate(userId, {
                $set: {
                    Firstname,
                    Lastname,
                    status,
                    skill_set,
                    profile_pic,
                    phone,
                    experience,
                    education,
                    certifications,
                    portfolio_link,
                    about_us
                }
            })
            const updatedUser = await candidateModel.findById(userId)
            updatedUser.password = undefined
            res.status(200).send({ message: "Candidate updated", _id: updatedUser._id })
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Somthing error' })
        }
    },

    addProfile: async (req, res) => {
        try {
            console.log('Hello');
            const userId = req.user._id
            const { Firstname, Lastname, status, skill_set, profile_pic } = req.body;
            await candidateModel.findByIdAndUpdate(userId, {
                $set: {
                    Firstname,
                    Lastname,
                    status,
                    skill_set,
                    profile_pic,
                    onboarding_1: true
                }
            })
            const updatedUser = await candidateModel.findById(userId).lean();
            // Remove _id from skill_set array
            if (updatedUser.skill_set) {
                updatedUser.skill_set = updatedUser.skill_set.map(skill => ({
                    skill: skill.skill,
                    percentage: skill.percentage
                }));
            }
            updatedUser.password = undefined
            res.status(200).send({ message: "Profile Updated", updatedUser: updatedUser })
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Somthing error' })
        }
    },

    addDetails: async (req, res) => {
        try {
            const userId = req.user._id
            let { phone, experience, education, certifications, portfolio_link, about_us } = req.body;


            function calculateExperienceForEachElement(experience) {
                return experience.map(exp => {
                    const startDate = moment(exp.start_date, 'DD-MM-YYYY');
                    const endDate = moment(exp.end_date, 'DD-MM-YYYY');
                    const years = endDate.diff(startDate, 'years');
                    const months = endDate.diff(startDate, 'months') % 12;

                    return `${years} Y ${months} M`;
                });
            }

            function calculateEducationTotalDuration(education) {
                return education.map(edu => {
                    const startDate = moment(edu.start_date, 'DD-MM-YYYY');
                    const endDate = moment(edu.end_date, 'DD-MM-YYYY');
                    const years = endDate.diff(startDate, 'years');
                    const months = endDate.diff(startDate, 'months') % 12;

                    return `${years} Y ${months} M`;
                });
            }

            const experienceDetails = calculateExperienceForEachElement(experience);
            const totalEducationDuration = calculateEducationTotalDuration(education);

            await candidateModel.findByIdAndUpdate(userId, {
                $set: {
                    phone,
                    experience: experience.map((exp, index) => ({
                        total_exp: experienceDetails[index], // Store the total experience as a formatted string
                        company_name: exp.company_name,
                        position: exp.position,
                        description: exp.description
                    })),
                    education: education.map((edu, index) => ({
                        course_name: edu.course_name,
                        provider: edu.provider,
                        education_exp: totalEducationDuration[index],
                    })),
                    certifications,
                    portfolio_link,
                    about_us,
                    onboarding_2: true
                }
            });
            function removeIdFromSubdocuments(obj) {
                if (Array.isArray(obj)) {
                    return obj.map(item => {
                        if (item && typeof item === 'object' && item._id) {
                            const { _id, ...rest } = item;
                            return rest;
                        }
                        return item;
                    });
                } else if (typeof obj === 'object' && obj !== null) {
                    for (const key in obj) {
                        obj[key] = removeIdFromSubdocuments(obj[key]);
                    }
                }
                return obj;
            }

            const updatedUser = await candidateModel.findById(userId).lean();
            const cleanedUser = removeIdFromSubdocuments(updatedUser);

            // Remove password field
            cleanedUser.password = undefined;

            res.status(200).send({ message: "Profile Updated", updatedUser: cleanedUser });


        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Somthing error' })
        }
    },

    jobs: async (req, res) => {
        try {
            function transformJobDocument(doc) {
                doc = doc.toObject();
                if (doc.required_skill_set && Array.isArray(doc.required_skill_set)) {
                    doc.required_skill_set = doc.required_skill_set.map(skill => {
                        if (skill._id) {
                            delete skill._id;
                        }
                        return skill;
                    });
                }
                return doc;
            }
            const jobs = await jobModel.find();
            const cleanedJobs = jobs.map(transformJobDocument);
            res.status(200).send(cleanedJobs);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Somthing error' })
        }
    },

    jobById: async (req, res) => {
        try {
            const jobById = req.params.id
            const job = await jobModel.findById(jobById)
            res.status(200).send(job)
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Somthing error' })
        }
    },

    jobsByskillSet: async (req, res) => {
        try {
            const userId = req.user._id;
            const candidate = await candidateModel.findById(userId);
            const skillset = candidate.skill_set
            const jobs = await jobModel.find()

            // Filter jobs based on the skillset criteria
            const matchingJobs = jobs.filter(job => {
                const requiredSkillSet = job.required_skill_set;

                if (!requiredSkillSet || requiredSkillSet.length === 0) {
                    return false;
                }
                // Check if all skills in req.body meet the percentage criteria for this job
                return skillset.every(reqSkill => {
                    const requiredSkill = requiredSkillSet.find(
                        jobSkill => jobSkill.skill_name === reqSkill.skill
                    );

                    return (
                        requiredSkill &&
                        reqSkill.percentage >= requiredSkill.min_skill_exprnce
                    );
                });
            });

            console.log(matchingJobs);

            res.status(200).json(matchingJobs)
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Somthing error' })
        }
    },

    viewProfile: async (req, res) => {
        try {
            const id = req.user._id
            function removeIdFromSubdocuments(obj) {
                if (Array.isArray(obj)) {
                    return obj.map(item => {
                        if (item && typeof item === 'object' && item._id) {
                            const { _id, ...rest } = item;
                            return rest;
                        }
                        return item;
                    });
                } else if (typeof obj === 'object' && obj !== null) {
                    for (const key in obj) {
                        obj[key] = removeIdFromSubdocuments(obj[key]);
                    }
                }
                return obj;
            }
            const profile = await candidateModel.findById(id).select('-password').lean();
            const cleanedProfile = removeIdFromSubdocuments(profile);
            res.status(200).send(cleanedProfile);
        } catch (err) {
            console.log(err)
            res.status(400).send(err);
        }
    }

}