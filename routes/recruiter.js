const express = require('express');
const recruiterController = require('../controller/recruiter-controller');
const passport = require('passport')
const router = express.Router();

router.get('/sign-in-jwt', passport.authenticate('recruiter-jwt', { session: false }), recruiterController.signInWithJwt)
router.get('/candidates', recruiterController.candidates)

router.post('/sign-up', recruiterController.signUp)
router.post('/sign-in', recruiterController.signIn)
router.post('/add-job',  passport.authenticate('recruiter-jwt', { session: false }), recruiterController.addJob)

router.put('/add-profile', passport.authenticate('recruiter-jwt', { session: false }), recruiterController.addProfile)

module.exports = router