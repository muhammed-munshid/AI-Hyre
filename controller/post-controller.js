const candidateModel = require('../model/candidateModel');
const notificationModel = require('../model/notificationModel');
const postModel = require('../model/postModel');
const recruiterModel = require('../model/recruiterModel');
const User = require('../model/userModal');

module.exports = {

    addPost: async (req, res) => {
        try {
            const user_id = req.user._id;
            const { text, image, video } = req.body;

            // Check if both image and video are present
            if (image && video) {
                return res.status(400).send({ message: 'Both image and video cannot be provided in a single post.' });
            }

            const post = new postModel({ user_id, text, image, video });
            await post.save();
            res.status(200).send(post);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    togglePost: async (req, res) => {
        try {
            const user_id = req.user._id
            const id = req.params.id
            // const likeId = req.body.like
            let msg = "";
            const post = await postModel.findById(id)
            // const checkingLike = post.likes.includes(user_id);
            // if (checkingLike === true) {
            //     await postModel.findByIdAndUpdate(id, {
            //         $set: {
            //             ckeckingLike: true
            //         }
            //     })
            // } else {
            //     await postModel.findByIdAndUpdate(id, {
            //         $set: {
            //             ckeckingLike: false
            //         }
            //     })
            // }
            // Check if the follower already exists in the 'following' field
            const likeIndex = post.likes.indexOf(user_id)
            if (likeIndex !== -1) {
                // Follower already exists, remove them from the 'following' field
                post.likes.splice(likeIndex, 1);
                msg = "removed";
            } else {
                // Follower doesn't exist, add them to the 'following' field
                post.likes.push(user_id);
                msg = "added";
                const likedUser = await User.findById(user_id).select('-password')
                const text = `${likedUser.name} started following you`
                const type = 'like'
                const link = user_id
                const notification = new notificationModel({ user_id, text, type, link, img: likedUser.profile_pic })
                await notification.save()
            }
            // Save the user with the updated 'following' field
            await post.save();

            res.json({ msg, updatedPost: post });
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    updatePost: async (req, res) => {
        try {
            const id = req.params.id
            const { text, image, video } = req.body;
            if (image && video) {
                return res.status(400).send({ message: 'Both image and video cannot be provided in a single post.' });
            }
            await postModel.findByIdAndUpdate(id, { text, image, video });
            const updatedPost = await postModel.findById(id)
            if (!updatedPost) {
                return res.status(400).send({ message: 'User not exist' });
            }
            res.status(200).send(updatedPost);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    deletePost: async (req, res) => {
        try {
            const id = req.params.id
            const post = await postModel.findById(id)
            if (post) {
                await postModel.deleteOne({ _id: id })
                res.status(200).send({ delete: true })
            } else {
                res.status(200).send({ message: 'This post is already deleted' })
            }
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
            await postModel.findByIdAndUpdate(id, {
                $push: {
                    comments: {
                        message,
                        user_id
                    }
                }
            });
            const likedUser = await User.findById(user_id).select('-password')
            console.log('likedUser: ', likedUser);
            const text = `${likedUser.Firstname + ' ' + likedUser.Lastname} started following you`
            const type = 'comment'
            const link = id
            const notification = new notificationModel({ user_id, text, type, link, img: likedUser.profile_pic })
            await notification.save()
            const updatePost = await postModel.findById(id)
            res.status(200).send(updatePost);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    viewAllPost: async (req, res) => {
        try {
            const posts = await postModel.find().populate({
                path: 'user_id',
                select: '-password'
            });

            res.status(200).send(posts);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    viewPostById: async (req, res) => {
        try {
            const postId = req.params.id;
            const post = await postModel.findById(postId).populate({
                path: 'user_id',
                select: 'name profile_pic'
            });

            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // The 'user_id' will point to the common User model
            const user = await User.findById(post.user_id).select('-password');

            if (user) {
                return res.status(200).json({ post });
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    },

    viewAllPostByFollowers: async (req, res) => {
        try {
            const id = req.user._id
            const user = await User.findById(id)
            console.log(user);
            const ids = user.followers
            const followers = await User.find({ _id: { $in: ids } });
            const followersIds = followers.map((follower) => follower._id);
            const posts = await postModel.find({ user_id: { $in: followersIds } }).populate({
                path: 'user_id',
                select: '-password'
            });
            res.status(200).send(posts);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

}