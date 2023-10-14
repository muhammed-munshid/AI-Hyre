const notificationModel = require('../model/notificationModel');
const postModel = require('../model/postModel');
const User = require('../model/userModal');

module.exports = {

    toggleFollower: async (req, res) => {
        try {
            const followerId = req.body.follower;
            let msg = "";
            const user = await User.findById(req.params.id).select('-passsword')
            const user_id = user._id
            const followerIndex = user.followers.indexOf(followerId);
            if (followerIndex !== -1) {
                // Follower already exists, remove them from the 'following' field
                user.followers.splice(followerIndex, 1);
                msg = "removed";
            } else {
                // Follower doesn't exist, add them to the 'following' field
                user.followers.push(followerId);
                msg = "added";
                const Follower = await User.findById(followerId).select('-password')
                const text = `${Follower.name} started following you`
                const type = 'follow'
                const link = followerId
                const notification = new notificationModel({ user_id, text, type, link, img:Follower.profile_pic })
                await notification.save()
            }

            // Save the user with the updated 'following' field
            await user.save();

            res.json({ msg, updatedUser: user });
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    addComment: async (req, res) => {
        try {
            const user_id = req.user._id
            const id = req.params.id
            const { message } = req.body;
            const updatePost = await postModel.findByIdAndUpdate(id, {
                $push: {
                    comments: {
                        message,
                        user_id
                    }
                }
            });
            res.status(200).send(updatePost);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    myFollowers: async (req, res) => {
        try {
            const id = req.params.id
            const user = await User.findById(id).populate('followers').select('-password')
            res.status(200).send(user.followers);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },



    followingMe: async (req, res) => {
        try {
            let user;

            const candidate = await candidateModel.findById(req.params.id);
            const recruiter = await recruiterModel.findById(req.params.id);

            if (candidate) {
                user = candidate;
            } else if (recruiter) {
                user = recruiter;
            } else {
                return res.status(500).send('Something error');
            }

            if (!user) {
                return res.status(401).json("User not found");
            }

            // Use populate to populate the 'following' field
            await user.populate('following');

            // Convert the result to a plain JavaScript object using lean()
            const populatedUser = user

            res.json(populatedUser.following.user_id);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

}