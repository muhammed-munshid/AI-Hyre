const express = require('express');
const userController = require('../controller/user-controller');
const passport = require('passport')
const router = express.Router();

passport.initialize();

router.get('/sign-in-jwt', passport.authenticate('jwt', { session: false }), userController.signInWithJwt)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    // Successful authentication, redirect or respond as needed
    res.redirect('/');
}
);

router.get('/jobs', passport.authenticate('jwt', { session: false }), userController.jobs)
router.get('/job-by-id/:id', passport.authenticate('jwt', { session: false }), userController.jobById)
router.get('/jobs-by-skillset', passport.authenticate('jwt', { session: false }), userController.jobsByskillSet)
router.get('/profile/:id', passport.authenticate('jwt', { session: false }), userController.viewProfile)
router.get('/chat/:id/messages', userController.messages)
router.get('/chat/v1/:id/user', userController.v1Chat)
router.get('/chat/:id/user', userController.viewChat)

router.post('/sign-up', userController.signUp)
router.post('/sign-in', userController.signIn)
router.post('/chat/create', userController.createChat)
router.post('/chat/:id/messages', userController.message)

router.put('/update-candidate', passport.authenticate('jwt', { session: false }), userController.updateCandidate)
router.put('/add-profile', passport.authenticate('jwt', { session: false }), userController.addProfile)
router.put('/add-details', passport.authenticate('jwt', { session: false }), userController.addDetails)

router.patch('/chats/:chatId/messages/:messageId', userController.updateChat)

module.exports = router