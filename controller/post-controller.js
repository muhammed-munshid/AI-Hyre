const candidateModel = require('../model/candidateModel');
const notificationModel = require('../model/notificationModel');
const postModel = require('../model/postModel');
const recruiterModel = require('../model/recruiterModel');
const User = require('../model/userModal');

module.exports = {

    addPost: async (req, res) => {
        try {
            const authorID = req.user._id;
            const pic = req.user.profile_pic;
            const name = req.user.name;
            const { text, image, video } = req.body;

            // Check if both image and video are present
            if (image && video) {
                return res.status(400).send({ message: 'Both image and video cannot be provided in a single post.' });
            }

            const post = new postModel({ author: { id: authorID, name, pic }, text, image, video, likes: [], comments: [] });
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
                const text = `${likedUser.name} liked your post`
                const type = 'like'
                const link = post._id
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

    viewLikedList: async (req, res) => {
        try {
            const id = req.params.id
            const posts = await postModel.findById(id).populate({
                path: 'likes',
                select: 'name profile_pic'
            });
            res.status(200).send(posts.likes);
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
            const commentedUser = await User.findById(user_id).select('-password')
            const text = `${commentedUser.name} commented your post`
            const type = 'comment'
            const link = id
            const notification = new notificationModel({ user_id, text, type, link, img: commentedUser.profile_pic })
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
            const posts = await postModel.find()
                .populate({
                    path: 'author',
                    select: 'id',
                    populate: {
                        path: 'id',
                        select: 'name profile_pic'
                    }
                })
            res.status(200).send(posts);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    viewPostById: async (req, res) => {
        try {
            const postId = req.params.id;
            const post = await postModel.findById(postId)
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.status(200).send(post);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    },

    viewAllPostByFollowers: async (req, res) => {
        try {
            const id = req.user._id;
            const user = await User.findById(id);
            const ids = user.followers;
            const followers = await User.find({ _id: { $in: ids } });
            const followersIds = followers.map((follower) => follower._id);
            const posts = await postModel.find({ 'author.id': { $in: followersIds } })
                .populate({
                    path: 'author.id',
                    select: 'name profile_pic',
                });

            res.status(200).send(posts);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }


}