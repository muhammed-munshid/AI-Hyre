const userModel = require("../model/userModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
                const users = await userModel.find()
                res.status(200).send({ message: 'Your signUp verificatoin successfully', users: users })
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
                    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                        expiresIn: '1d'
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