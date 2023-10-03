const express = require('express');
const userController = require('../controller/user-controller');
const passport = require('passport')
const router = express.Router();

passport.initialize();

router.get('/sign-in-jwt',passport.authenticate('user-jwt', { session: false }),userController.signInWithJwt)
router.get('/jobs',passport.authenticate('user-jwt', { session: false }),userController.jobs)
router.get('/job-by-id/:id',passport.authenticate('user-jwt', { session: false }),userController.jobById)
router.get('/jobs-by-skillset',passport.authenticate('user-jwt', { session: false }),userController.jobsByskillSet)
router.get('/chat/:id/messages',userController.messages)
router.get('/chat/v1/:id/user',userController.v1Chat)
router.get('/chat/:id/user',userController.viewChat)

router.post('/sign-up',userController.signUp)
router.post('/sign-in',userController.signIn)
router.post('/chat/create', userController.createChat)
router.post('/chat/:id/messages', userController.message)

router.put('/add-profile',passport.authenticate('user-jwt', { session: false }),userController.addProfile)
router.put('/add-details',passport.authenticate('user-jwt', { session: false }),userController.addDetails)

router.patch('/chats/:chatId/messages/:messageId', userController.updateChat)

module.exports = router