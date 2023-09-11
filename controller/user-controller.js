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
            res.json({ authorization: true, userId: req.user._id, username: req.user.email });
    } catch(error) {
        console.log(error);
        res.status(500).send({ error: 'Failed to SignIn' })
    }
},


    addProfile: async (req, res) => {
        try {
            const userId = req.params.id
            const { name, status, skill_set, profile_pic } = req.body;
            await userModel.findByIdAndUpdate(userId, {
                $set: {
                    name,
                    status,
                    skill_set,
                    profile_pic
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
                const userId = req.params.id
                const { phone, location, experience, certifications, github_link } = req.body;
                await userModel.findByIdAndUpdate(userId, {
                    $set: {
                        phone,
                        location,
                        experience,
                        certifications,
                        github_link
                    }
                })
                const updatedUser = await userModel.findById(userId)
                updatedUser.password = undefined
                res.status(200).send({ message: "Details Added", updatedUser: updatedUser })
            } catch (error) {
                console.log(error);
                res.status(500).send({ error: 'Somthing error' })
            }
        },

}