const recruiterModel = require('../model/recruiterModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

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
                const recruiters = await recruiterModel.find()
                res.status(200).send({ message: 'Your signUp verificatoin successfully', recruiters: recruiters })
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
                    const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SECRET, {
                        expiresIn: '30d'
                    })
                    res.status(200).send({ message: "Login Successfull", token: token })
                }
            } else {
                res.status(200).send({ message: "Incorrect Email or Password" })
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Failed to SignIn' })
        }
    },

}