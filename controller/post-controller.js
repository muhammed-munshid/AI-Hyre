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
            const id = req.user._id
            const likeId = req.body.like
            let msg = "";
            const user = await User.findById(id).select('-password')
            // Check if the follower already exists in the 'following' field
            const likeIndex = user.profile_likes.indexOf(likeId);
            if (likeIndex !== -1) {
                // Follower already exists, remove them from the 'following' field
                user.profile_likes.splice(likeIndex, 1);
                const postLike = await postModel.findOne({ user_id: id })
                await postModel.findOneAndUpdate({ user_id: id }, {
                    $pull: {
                        likes: likeId
                    }
                })
                msg = "removed";
            } else {
                // Follower doesn't exist, add them to the 'following' field
                user.profile_likes.push(likeId);
                await postModel.findOneAndUpdate({ user_id: id }, {
                    $push: {
                        likes: likeId
                    }
                })
                msg = "added";
                const likedUser = await User.findById(likeId).select('-password')
                console.log('likedUser: ', likedUser);
                const text = `${likedUser.Firstname + ' ' + likedUser.Lastname} started following you`
                const type = 'like'
                const link = likeId
                const notification = new notificationModel({ user_id, text, type, link, img: likedUser.profile_pic })
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
            const link = likeId
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
            const post = await postModel.findById(postId).populate('user_id');

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