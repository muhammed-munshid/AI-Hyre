const express = require('express');
const candidateController = require('../controller/candidate-controller');
const passport = require('passport')
const router = express.Router();

passport.initialize();

router.get('/sign-in-jwt', passport.authenticate('jwt', { session: false }), candidateController.signInWithJwt)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    // Successful authentication, redirect or respond as needed
    res.redirect('/');
}
);

router.get('/jobs', candidateController.jobs)
router.get('/job-by-id/:id', passport.authenticate('jwt', { session: false }), candidateController.jobById)
router.get('/jobs-by-skillset', passport.authenticate('jwt', { session: false }), candidateController.jobsByskillSet)
router.get('/profile', passport.authenticate('jwt', { session: false }), candidateController.viewProfile)

router.post('/sign-up', candidateController.signUp)
router.post('/sign-in', candidateController.signIn)

router.put('/update-candidate', passport.authenticate('jwt', { session: false }), candidateController.updateCandidate)
router.put('/add-profile', passport.authenticate('jwt', { session: false }), candidateController.addProfile)
router.put('/add-details', passport.authenticate('jwt', { session: false }), candidateController.addDetails)

module.exports = router