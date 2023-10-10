const express = require('express');
const postController = require('../controller/post-controller');
const passport = require('passport')
const router = express.Router();

passport.initialize();

router.get('/view-all', passport.authenticate('jwt', { session: false }), postController.viewAllPost)
router.get('/:id', postController.viewPostById)
router.get('/view-by-followers', passport.authenticate('jwt', { session: false }), postController.viewAllPostByFollowers)

router.post('/create-post', passport.authenticate('jwt', { session: false }), postController.addPost)
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), postController.addComment)

router.put('/toggle-like/:id', passport.authenticate('jwt', { session: false }), postController.togglePost)
router.put('/update-post/:id', passport.authenticate('jwt', { session: false }), postController.updatePost)

router.delete('/delete-post/:id', passport.authenticate('jwt', { session: false }), postController.deletePost)

module.exports = router