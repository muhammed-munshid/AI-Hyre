const postModel = require('../model/postModel');
const recruiterModel = require('../model/recruiterModel');

module.exports = {

    addPost: async (req, res) => {
        try {
            const user_id = req.user._id;
            const { text, image, video } = req.body;

            // Check if both image and video are present
            if (image && video) {
                return res.status(400).send('Both image and video cannot be provided in a single post.');
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
            const like = req.body.like
            const candidate = await candidateModel.findById(id)
            const recruiter = await recruiterModel.findById(id)
            if (candidate) {
                if (like === true) {
                    res.status(200).send({ name: candidate.Firstname + " " + candidate.Lastname, profile_picture: candidate.profile_pic });
                }
            } else if (recruiter) {
                if (like === true) {
                    res.status(200).send({ name: recruiter.name, profile_picture: recruiter.profile_pic });
                }
            } else {
                res.status(500).send('something error');
            }
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
                return res.status(400).send('Both image and video cannot be provided in a single post.');
            }
            await postModel.findByIdAndUpdate(id, { text, image, video });
            const updatedPost = await postModel.findById(id)
            res.status(200).send(updatedPost);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    deletePost: async (req, res) => {
        try {
            const id = req.params.id
            await postModel.deleteOne({ _id: id })
            res.status(200).send({ delete: true })
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    addComment: async (req, res) => {
        try {
            const user_id = req.user._id
            const id = req.params.id
            console.log(id);
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

    viewAllPost: async (req, res) => {
        try {
            const posts = await postModel.find()
            res.status(200).send(posts);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    viewPostById: async (req, res) => {
        try {
            const id = req.params.id
            const post = await postModel.findById(id)
            res.status(200).send(post);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    viewAllPostByFollowers: async (req, res) => {
        try {
            const id = req.user._id
            const candidate = await candidateModel.findById(id)
            const recruiter = await recruiterModel.findById(id)
            if (candidate) {
                const candidate = await candidateModel.findById(id).populate('followers')
                console.log('ids: ', candidate.followers);
                res.status(200).send(candidate.followers);
                
            } else if (recruiter) {
                const recruiter =  await recruiterModel.findById(id).populate('followers')
                console.log('ids: ', recruiter.followers);
                res.status(200).send(candidate.followers);

            } else {
                console.log('user not found');
            }
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

}