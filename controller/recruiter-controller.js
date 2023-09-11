const recruiterModel = require('../model/recruiterModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');

module.exports = {

    signUp: async (req, res) => {
        try {
            let { name, email, password, company_name, location, phone, profile_pic, company_verified, website_link } = req.body;
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            password = hashedPassword
            const recruiterExist = await recruiterModel.findOne({ email: email })
            if (!recruiterExist) {
                const recruiter = new recruiterModel({
                    name,
                    email,
                    password,
                    company_name,
                    location,
                    phone,
                    profile_pic,
                    company_verified,
                    website_link
                });
                await recruiter.save();
                const newRecruiter = await recruiterModel.findOne({ email: email })
                newRecruiter.password = undefined
                res.status(200).send({ message: 'Your Sign-up verification was successful', newRecruiter: newRecruiter })
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
            const recruiter = await recruiterModel.findOne({ email: email })
            if (recruiter) {
                const isMatchPswrd = await bcrypt.compare(password, recruiter.password)
                if (!isMatchPswrd) {
                    res.status(200).send({ message: "Incorrect Password" })
                } else {
                    // eslint-disable-next-line no-undef
                    const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SECRET_RECRUITER, {
                        expiresIn: '30d'
                    })
                    res.status(200).send({ message: "Login Successfull", recruiterId: recruiter._id, recruiterName: recruiter.name, token: token })
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
            res.json({ authorization: true, recruiterId: req.user._id, recruiterName: req.user.email });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Failed to check JWT' })
        }
    },

    addProfile: async (req, res) => {
        try {
            const recruiterId = req.user._id
            const { name, company_name, location, phone, profile_pic, company_verified, website_link } = req.body;
            await recruiterModel.findByIdAndUpdate(recruiterId, {
                $set: {
                    name,
                    company_name,
                    location,
                    phone,
                    profile_pic,
                    company_verified,
                    website_link
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


    candidates: async (req, res) => {
        try {
            const candidates = await userModel.find({}, { password: 0 })
            console.log(candidates);
            res.status(200).send({ candidates: candidates })
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Failed to SignIn' })
        }
    },


}