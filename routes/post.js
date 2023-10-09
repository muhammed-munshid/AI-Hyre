const express = require('express');
const postController = require('../controller/post-controller');
const passport = require('passport')
const router = express.Router();

passport.initialize();

// router.get('/:id/messages', passport.authenticate('jwt', { session: false }), postController.viewMessageById)

router.post('/create-post', passport.authenticate('jwt', { session: false }), postController.addPost)
router.post('/comment/:id',passport.authenticate('jwt', { session: false }), postController.addComment)

router.put('/toggle-like/:id',passport.authenticate('jwt', { session: false }), postController.togglePost)

module.exports = router