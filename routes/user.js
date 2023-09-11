const express = require('express');
const userController = require('../controller/user-controller');
const passport = require('passport')
const router = express.Router();

passport.initialize();

router.get('/sign-in-jwt',passport.authenticate('user-jwt', { session: false }),userController.signInWithJwt)

router.post('/sign-up',userController.signUp)
router.post('/sign-in',userController.signIn)

router.put('/add-profile/:id',userController.addProfile)
router.put('/add-details/:id',userController.addDetails)

module.exports = router