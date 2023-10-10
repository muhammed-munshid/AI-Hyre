const postModel = require('../model/postModel');

module.exports = {

    toggleFollower: async (req, res) => {
        try {
            const followerId = req.body.follower;
            let msg = "";
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

            // Check if the follower already exists in the 'following' field
            const followerIndex = user.followers.indexOf(followerId);
            if (followerIndex !== -1) {
                // Follower already exists, remove them from the 'following' field
                user.followers.splice(followerIndex, 1);
                msg = "removed";
            } else {
                // Follower doesn't exist, add them to the 'following' field
                user.followers.push(followerId);
                msg = "added";
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
            console.log(updatePost);
            res.status(200).send(updatePost);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    myFollowers: async (req, res) => {
        try {
            const userId = req.params.id;
    
            // Determine whether the user is a candidate or recruiter
            const candidate = await candidateModel.findById(userId).select('-password')
            const recruiter = await recruiterModel.findById(userId).select('-password')
    
            if (candidate) {
                // If the user is a candidate, populate followers with recruiters
                const populatedFollowers = await candidateModel
                    .findById(userId)
                    .populate('followers') // Replace 'name' with the fields you want to populate
                    .exec();
                res.status(200).send(populatedFollowers.followers);
            } else if (recruiter) {
                // If the user is a recruiter, populate followers with candidates
                const populatedFollowers = await recruiterModel
                    .findById(userId)
                    .populate('followers') // Replace 'Firstname' with the fields you want to populate
                    .exec();
                res.status(200).send(populatedFollowers.followers);
            } else {
                return res.status(500).send('User not found');
            }
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