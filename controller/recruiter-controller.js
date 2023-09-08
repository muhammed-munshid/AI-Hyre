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
                    const token = jwt.sign({ id: recruiter._id }, process.env.JWT_SECRET, {
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
            const { token } = req.body;
            jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
                if(err){
                    console.log(err);
                    return res.status(401).send({
                        message: "You have no account, Please Login",
                        noToken:true
                    })
                }else{
                    req.body.userId=decoded.id;
                }
            })
            res.status(200).send({ message: "Login Successfull", recruiterId: recruiter._id, recruiterName: recruiter.name, token: token })
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Failed to SignIn' })
        }
    },


    candidates: async (req, res) => {
        try {
            const candidates = await userModel.find()
            res.status(200).send({ candidates: candidates })
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Failed to SignIn' })
        }
    },


}