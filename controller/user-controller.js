const userModel = require("../model/userModel");
const bcrypt = require('bcrypt')
const crypto = require('crypto-js')
const jwt = require('jsonwebtoken');
const jobModel = require("../model/jobModel");
const moment = require('moment');
const recruiterModel = require("../model/recruiterModel");
const { candidates } = require("./recruiter-controller");
const chatModel = require("../model/chatModel");

module.exports = {

    signUp: async (req, res) => {
        try {
            let { email, password } = req.body;
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            password = hashedPassword
            const userExist = await userModel.findOne({ email: email })
            if (!userExist) {
                const user = new userModel({
                    email,
                    password
                });
                await user.save();
                const newUser = await userModel.findOne({ email: email })
                newUser.password = undefined
                res.status(200).send({ message: 'Your Sign-up verification was successful', newUser: newUser })
            } else {
                res.status(200).send({ message: 'You are already registered' })
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Something Error' })
        }
    },

    signIn: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await userModel.findOne({ email: email })
            if (user) {
                const isMatchPswrd = await bcrypt.compare(password, user.password)
                if (!isMatchPswrd) {
                    res.status(200).send({ message: "Incorrect Password" })
                } else {
                    // eslint-disable-next-line no-undef
                    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_USER, {
                        expiresIn: '30d'
                    })
                    res.status(200).send({ message: "Login Successfull", userId: user._id, userName: user.name, token: token })
                }
            } else {
                res.status(200).send({ message: "Incorrect Email or Password" })
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Failed to SignIn' })
        }
    },

    signInWithJwt: async (req, res) => {
        try {
            if (req.user) {
                await userModel.findByIdAndUpdate(req.user._id, {
                    $set: {
                        user_verified: true
                    }
                })
                const user = await userModel.findById(req.user._id)
                if (user.on_boarding_1 == true) {
                    res.json({ authorization: true, userId: req.user._id, username: req.user.email, on_boarding_1: true });
                } else {
                    res.json({ authorization: true, userId: req.user._id, username: req.user.email, on_boarding_1: false })
                }
            } else {
                res.json({ authorization: false });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Failed to SignIn' })
        }
    },


    addProfile: async (req, res) => {
        try {
            const userId = req.user._id
            const { name, status, skill_set, profile_pic } = req.body;
            await userModel.findByIdAndUpdate(userId, {
                $set: {
                    name,
                    status,
                    skill_set,
                    profile_pic,
                    on_boarding_1: true
                }
            })
            const updatedUser = await userModel.findById(userId)
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

            await userModel.findByIdAndUpdate(userId, {
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
                    about_us
                }
            });
            const updatedUser = await userModel.findById(userId)
            updatedUser.password = undefined
            res.status(200).send({ message: "Details Added", updatedUser: updatedUser })
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

    jobsByskillSet: async (req, res) => {
        try {
            const userId = req.user._id;
            const candidate = await userModel.findById(userId);
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

    messages: async (req, res) => {
        try {
            const chat = await chatModel.findById(req.params.id).populate('users messages.sender messages.receiver', 'name email');
            res.send(chat.messages);
        } catch (err) {
            console.log(err)
            res.status(400).send(err);
        }
    },

    //list of all the chats that the user is a part of
    v1Chat: async (req, res) => {
        try {
            const { id } = req.params;
            const chats = await chatModel.find({ users: id })
                .populate('users', 'username')
                .populate({
                    path: 'messages',
                    options: { sort: { time: -1 }, limit: 1 },
                    populate: {
                        path: 'sender receiver',
                        select: 'username'
                    }
                })
                .exec();
            const chatList = chats.map(chat => ({
                id: chat._id,
                users: chat.users,
                post: chat.post,
                lastMessage: chat.messages[0]?.message,
                lastMessageTime: chat.messages[0]?.time
            }));
            res.send(chatList);
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },

    //same as above
    viewChat: async (req, res) => {
        try {
            const { id } = req.params;
            const chats = await chatModel.find({ users: id })
                .populate({ path: 'users', select: 'name image', transform: 'username' })
                .populate({
                    path: 'messages',
                    options: { sort: { time: -1 }, limit: 1 },
                    populate: {
                        path: 'sender receiver',
                        select: 'username'
                    }
                })
                .exec();
            const chatList = await Promise.all(chats.map(async chat => {
                const unreadCount = await chatModel.countDocuments({
                    _id: chat._id,
                    'messages.status': 'sent',
                    'messages.sender': { $ne: id }
                });
                return {
                    id: chat._id,
                    users: chat.users,
                    post: chat.post,
                    lastMessage: chat.messages[0]?.message,
                    lastMessageTime: chat.messages[0]?.time,
                    unreadCount
                };
            }));
            res.send(chatList);
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },

    doChat: async (req, res) => {
        try {
            const { users, post } = req.body;

            // Check if a chat already exists between the two users and post
            const existingChat = await chatModel.findOne({ users: { $all: users }, job_post: post });

            if (existingChat) {
                // A chat already exists, so return it instead of creating a new one
                res.status(200).send(existingChat);
                return;
            }

            // Create a new chat if one doesn't already exist
            const chat = new chatModel({ users, post });
            await chat.save();
            res.status(201).send(chat);
        } catch (err) {
            res.status(400).send(err);
        }
    },

    //Adding a message into a chat:
    message: async (req, res) => {
        try {
            const chat = await chatModel.findById(req.params.id);
            const { message, sender, receiver } = req.body;
            const messageId = crypto.randomBytes(5).toString('hex');
            chat.messages.push({ id: messageId, message, sender, receiver, status: 'sent', time: Date.now() });
            await chat.save();
            res.status(201).send(chat);
        } catch (err) {
            res.status(400).send(err);
        }
    },

    //update the status of an individual message in a chat
    updateChat: async (req, res) => {
        try {
            const { chatId, messageId } = req.params;
            const { status } = req.body;
            const chat = await chatModel.findById(chatId);
            const messageIndex = chat.messages.findIndex(message => message.id === messageId);
            if (messageIndex === -1) {
                return res.status(404).send({ error: 'Message not found' });
            }
            chat.messages[messageIndex].status = status;
            await chat.save();
            res.send(chat);
        } catch (err) {
            res.status(400).send(err);
        }
    }

}