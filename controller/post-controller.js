const postModel = require('../model/postModel');

module.exports = {

    addPost: async (req, res) => {
        try {
            const user_id = req.user._id
            const { text, image, video, comments } = req.body;
            const post = new postModel({ user_id, text, image, video, comments });
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

}